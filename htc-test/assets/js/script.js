document.addEventListener('DOMContentLoaded', function () {

  // TABS
  let tabs = (function () {
    let tabsControl = document.querySelectorAll('.tabs-menu__item'),
      tabsContent = document.querySelectorAll('.tabs'),
      activeTab = tabsControl[0],
      activeIndex = 0,
      carret = document.querySelector('.tabs-menu__point'),



      init = () => {
        activeTab.classList.add('tabs-menu__item--active');
        tabsContent[activeIndex].classList.add('tabs--show');

        setTimeout(() => {
          setCarret();
          carret.classList.add('tabs-menu__point--ready')
        }, 200)

        tabsControl.forEach((item, index) => {
          item.addEventListener('click', () => {
            showTab(index);
          })
        });
      },



      setCarret = () => {
        carret.style.width = activeTab.offsetWidth + 'px';

        let offset = 0;

        [...tabsControl].slice(0, activeIndex).forEach(i => {
          offset += i.offsetWidth + +window.getComputedStyle(i).marginRight.match(/\d/g).join('')
        })

        carret.style.transform = `translate(${offset}px)`
      },



      showTab = (i) => {
        activeIndex = i;
        activeTab = tabsControl[activeIndex];

        setCarret();

        [...tabsControl, ...tabsContent].forEach(i => {
          i.classList.remove('tabs-menu__item--active', 'tabs--show');
        });

        activeTab.classList.add('tabs-menu__item--active');
        tabsContent[activeIndex].classList.add('tabs--show');
      };



    return {
      init
    }
  })();

  tabs.init();

  // SCROLL

  const scroll = document.querySelector('.scroll');
  const scrollThumb = document.querySelector('.scroll-drag');
  const scrollingContent = document.querySelector('.chanels');
  const tv = document.querySelector('.chanels-menu');

  let coord = 2;
  scrollThumb.style.transform = 'translate( 0, 2px)';

  let scrollMove = (event) => {
    coord += event;
    if (coord > 192) { coord = 192; return scrollThumb.style.transform = 'translate( 0,' + 192 + 'px)'; }
    if (coord < 2) { coord = 2; return scrollThumb.style.transform = 'translate( 0,' + 2 + 'px)'; }
    scrollThumb.style.transform += 'translate( 0,' + event + 'px)';
  };
  let scrollClick = (event) => {
    scrollThumb.style.transform = 'translate( 0,' + event + 'px)';
  };
  scrollingContent.addEventListener('wheel', (event) => {
    let scroll = event.deltaY.toString().replace(/[0-9]/g, '') + 125;
    scrollMove(Number(scroll));

  });

  scrollThumb.onmousedown = () => {

    let onMouseMove = (event) => {
      if ((coord <= 192 && event.movementY > 0) || (coord >= 2 && event.movementY < 0)) {
        scrollMove(event.movementY);
        scrollingContent.scrollTop += event.movementY;
      }
    };
    tv.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function (event) {
      tv.removeEventListener('mousemove', onMouseMove);
      tv.onmouseup = null;
    };
  };
  scrollThumb.ondragstart = function () {
    return false;
  };
  scroll.onclick = (event) => {
    if (event.target === scroll) {
      if (event.offsetY > 500) {
        scrollClick(event.offsetY - 500);
        scrollingContent.scrollTop = event.offsetY - 500;
      } else {
        scrollClick(event.offsetY);
        scrollingContent.scrollTop = event.offsetY;
      }
    }
  };

  //MODAL

  const buttonLogin = document.querySelector('.header-btn-js');
  const modalWrap = document.querySelector('.modal-wrap');
  const modal = document.querySelector('.modal-form-js');
  const inLogin = document.querySelector('.login-js');
  const inPassword = document.querySelector('.password-js');
  const checkBox = document.querySelector('.check-modal');
  const modalBtn = document.querySelector('.modal-btn-js');
  
  let user = {
      name: "Константин К.",
      remember: false,
      login: "admin",
      password: "admin"
  };
  
  let validationName = (name) => {
      let tempName = name.value;
      if (/[а-яё]{1,20}/.test(tempName)) {
          user.name = tempName
              .toLowerCase()
              .split(/\s+/)
              .map(word => word[0].toUpperCase() + word.substring(1))
              .join(' ')
              .replace(/(.+) (.).+/, '$1 $2.')
              .replace(/(.+) (.).+ (.).+/, '$1 $2. $3.');
          return true;
      }
      if (/[0-9]/.test(tempName)) {
          return false;
      }
  };
  let validationLogin = (login, password) => {
      if (login === user.login && password === user.password) {
          if (checkBox.checked) {
              localStorage.setItem(user.login, user.name);
          }
          authorisation();
      }
      if (login === "" || password === "") {
          return error('Поля логин и пароль обязательны к заполнению');
      }
      if (!/^[a-zA-Z1-9]+$/.test(login)) {
          return error('В логине должны быть только латинские буквы ');
      }
      if (login.length < 4 || login.length > 20) {
          return error('В логине должено быть от 4 до 20 символов');
      }
      if (parseInt(login.substr(0, 1))) {
          return error('Логин должен начинаться с буквы');
      }
      if (login !== user.login || password !== user.password) {
          return error('Проверьте правильность введенных данных');
      }
  
  };
  let authorisation = () => {
      const insertTo = document.querySelector('.btn-wrap');
      const inputName = document.createElement('input');
      const buttonExit = document.createElement('button');
  
      buttonLogin.classList.toggle('deactive');
  
      buttonExit.innerHTML = 'Выйти';
      buttonExit.classList.add('btn--exit');
  
      inputName.value = user.name;
      inputName.setAttribute('onfocus', 'this.select()');
      inputName.setAttribute('maxlength', '14');
      inputName.classList.add('input-user');
  
      insertTo.append(inputName);
      insertTo.append(buttonExit);
      insertTo.classList.toggle('btn-wrap--active');
  
      modalWrap.classList.add('modal-wrap--deactive');
  
      inputName.addEventListener('blur', (event) => {
          if (user.name === inputName.value) {
              return 1;
          }
          if (validationName(inputName)) {
              inputName.value = user.name;
              localStorage.removeItem(user.login);
              localStorage.setItem(user.login, user.name);
          } else {
              inputName.value = user.name;
          }
      });
      buttonExit.addEventListener('click', (event) => {
          inputName.remove();
          buttonExit.remove();
          localStorage.removeItem(user.login);
          buttonLogin.classList.toggle('deactive');
          insertTo.classList.remove('btn-wrap--active');
      });
  };
  let error = (str) => {
      const message = document.createElement('div');
      message.classList.add('error');
      message.textContent = str;
      if (modalWrap.children.length === 1) {
          modalWrap.append(message);
          setTimeout(() => message.classList.add('error-click'), 0);
          setTimeout(() => message.classList.remove('error-click'), 2500);
          setTimeout(() => message.remove(), 2600);
      }
  };
  
  buttonLogin.addEventListener('click', (event) => {
      modalWrap.classList.toggle('modal-wrap--deactive');
  
  });
  modalWrap.addEventListener('click', (event) => {
      if (event.target === modalWrap) {
          modalWrap.classList.toggle('modal-wrap--deactive');
      }
  });
  
  document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape' && modalWrap.classList.contains('modal-wrap--deactive') === false) {
          modalWrap.classList.add('modal-wrap--deactive');
          (function del() {
              document.removeEventListener("keyup", del);
          }());
      }
  });
  modalBtn.addEventListener('click', (event) => {
      validationLogin(inLogin.value, inPassword.value);
  });
  
  (function () {
      for (let key in localStorage) {
          if (key === user.login) {
              user.name = localStorage.getItem(user.login);
              authorisation();
          }
      }
  }());

});

