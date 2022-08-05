
/**
 * Accordion 
 * 
 * We need a specified html-structure:
 * 
 * Wrapper with cssID
 * 
 * Each accordion element has two childs (toggler and body).
 * Our body then needs a single child element which gives us our body-height, 
 * even when the body-height is set to zero (closed).
 * 
 * The accordion element needs an data-attribute: accopen (true/false)
 * 
 * @param {object} options options
 */
function accordion(options) {
  let accElements = [];

  // we dont want to execute our function if accElements is empty
  if (options.id != undefined) accElements = document.querySelectorAll(`${'#' + options.id} .accordionElem`);
  else return;

  accElements.forEach(function (accElem) {
    let toggler = accElem.children[0];
    let body = accElem.children[1];
    let bodyHeight = body.children[0].offsetHeight;

    // set inline-style otherwise we dont get animation on first click, when page has loaded
    // body.setAttribute('style', 'height: 0px;');

    // add eventListerner on toggler
    toggler.addEventListener('click', () => {
      // get boolean out of string from data-attribute
      let isOpen = accElem.dataset.accopen === 'true';

      // multiOpen -> decide if we close active elements when others open
      options.multiOpen = typeof options.multiOpen !== 'undefined' ? options.multiOpen : false;

      if (options.multiOpen === false) {
        let active = getActive();
        if (active) close(active);
      }

      // when data-value was 'false' we open, otherwise we close 
      if (!isOpen) open(accElem, bodyHeight)
      else close(accElem);
    });

    // update height on window resize 
    window.addEventListener('resize', () => updateHeight(accElem));
  });

  // Helperfunction
  const updateHeight = (elem) => {
    // setTimeout -> because of the time that animation needs to resize the height
    setTimeout(() => {
      bodyHeight = elem.children[1].children[0].offsetHeight;
      // animate active element height
      let active = getActive();
      if (!active) return;
      active.children[1].setAttribute('style', 'height:' + getActiveBodyHeigth() + 'px;');
    }, 400)
  }

  // Helperfunction
  const open = (elem, bodyHeight) => {
    let body = elem.children[1];
    let toggler = elem.children[0];
    // set height
    body.setAttribute('style', 'height:' + bodyHeight + 'px;');
    // set data-value
    elem.dataset.accopen = 'true';
    // add classes to active element
    elem.classList.add('active');
    toggler.classList.add('active');
  }

  // Helperfunction
  const close = (elem) => {
    setBodyHeigth(elem, 0);
    let toggler = elem.children[0];
    // set data-value
    elem.dataset.accopen = 'false';
    // remove classes from active element
    elem.classList.remove('active');
    toggler.classList.remove('active');
  }

  // Helperfunction
  const getActive = () => {
    let active = false;
    accElements.forEach(accElem => {
      if (accElem.dataset.accopen === 'true') {
        active = accElem;
      }
    })
    return active;
  };

  // Helperfunction
  const getActiveBodyHeigth = () => {
    return getActive().children[1].children[0].offsetHeight;
  };

  // Helperfunction
  const setBodyHeigth = (elem, heigth) => {
    let body = elem.children[1];
    body.setAttribute('style', `height: ${heigth}px;`);
  };
};