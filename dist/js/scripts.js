function inlineSize(el) {
  // дополнительные стили для клона, что бы мир не заметил чуда, и размеры отображались корректно
  let hiddenStyle = "left:-10000px;top:-10000px;height:auto;width:auto;position:absolute;white-space:nowrap;word-break:keep-all;box-sizing:border-box";

  // создаем box элемент
  // для клонирования содержимого из нашего исходного inline блока
  let clone = document.createElement('div');

  // в обязательном порядке копируем стили с исходного элемента,
  // что бы размеры соответствовали исходнику.
  for (let i in el.style) {
    try {
      if ((el.style[i] != '') && (el.style[i].indexOf(":") > 0)) {
        clone.style[i] = el.style[i];
      }
    } catch (e) {}
  }


  // устанавливаем стили у клона, дабы он не мозолил глаз.
  // Учитываем, что IE не позволяет напрямую устанавливать значение аттрибута style
  document.all ? clone.style.setAttribute('cssText', hiddenStyle) : clone.setAttribute('style', hiddenStyle);

  // Переносим содержимое. Аккуратно.
  clone.innerHTML = el.innerHTML

  // Добавляем клон в корневой документ.
  // Так, на всякий пожарный в parent, а то вдруг элемент внутри iframe?
  parent.document.body.appendChild(clone);

  // Забиваем заветное.
  var rect = {width:clone.clientWidth,height:clone.clientHeight};

  // ...и тут же удаляем
  parent.document.body.removeChild(clone);

  // Вот собственно говоря и все.
  return rect;
}



$(document).ready(function () {
  // $('.open>.scrollbar-inner').scrollbar();
  $('.scrollbar-inner').scrollbar();
  $('.scrollbar-outer').scrollbar();
  $('.scrollbar-dynamic').scrollbar();


  let closeBlock = function(sel, cls, bodyCls) {
    $(sel).removeClass(cls);
    $(sel).find('.' + cls).removeClass(cls);
    if (bodyCls) $('body').removeClass(bodyCls);
  }

  $('.burger').on('click',function (e) {
    e.preventDefault();
    $(this).toggleClass('open');
    $(this).closest('.menu-block').toggleClass('open');
    $('body').toggleClass('menu-opened');
  });

  $('.header-search-mobile-btn').on('click',function (e) {
    e.preventDefault();
    e.currentTarget.parentNode.classList.toggle('open');
    $('body').toggleClass('search-form-opened');
  });


  $(document).click(function(e) {
    e.stopPropagation();
    let menuOpened = $('body').hasClass('menu-opened');
    let headerSearchOpened = $('body').hasClass('search-form-opened');

    if (!$(e.target).closest('.menu-block').length && menuOpened) {
      closeBlock('.menu-block','open','menu-opened')
    }

    if (!$(e.target).closest(".header-search-block").length && headerSearchOpened) {
      closeBlock('.header-search-block','open','search-form-opened')
    }

  });

// закрытие меню - конец

  let validateFiled = function(el) {
    const emailValidStr = new RegExp('.+@.+\\..+');
    const phoneValidStr = new RegExp('^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$');

    let elType = el.type;
    let elVal = el.value;
    // let elReq = el.attributes.required;
    let elReq = el.required;
    let valid = false;


    // console.log(el,elType,elVal,elReq);
    // console.log('elType: ',elType);
    // console.log('elVal: ',elVal);
    // console.log('elReq: ',elReq);


    switch (elType) {
      case 'number' :
        valid = parseInt(elVal,10) || 0;
        break;
      case 'tel' :
        valid = phoneValidStr.test(elVal) || elVal.length === 0;
        break;
      case 'email' :
        valid = emailValidStr.test(elVal) || elVal.length === 0;
        break;
      case 'text' :
        valid = (elVal.length > 0 && elReq) || (elVal.length >= 0 && !elReq);
        break;
      case 'textarea' :
        // console.log('textarea!!!');
        valid = (elVal.length > 0 && elReq) || (elVal.length >= 0 && !elReq);
        break;
    }
    // console.log('valid: ',valid);

    return valid;

  }


 let setValidateClasses = function(el){
   let formItem = el.closest('.form-item').classList;
   if(el.value.length) {
     if (!validateFiled(el)) {
       formItem.add('validate-error');
       formItem.remove('valid')
     } else {
       formItem.add('valid')
       formItem.remove('validate-error')
     }
   } else {
     formItem.remove('validate-error');
     formItem.remove('valid')
   }

 }

  $('.form-item input, .form-item textarea').on('blur',function (e) {
    e.preventDefault();
    setValidateClasses(e.currentTarget);
  });

  $('.disabled').find('input, textarea').each(function () {
    this.setAttribute('disabled', 'disabled');
  });



  $('.arrow.up').on('click',function (e) {
    let inp = document.querySelector('input[data-input-id="' + e.currentTarget.parentNode.dataset.inputId + '"]');
    if(inp) {
      let val = parseInt(inp.value,10) || 0;
      inp.value = val + 1;
      setValidateClasses(inp);
    }
  });

  $('.arrow.down').on('click',function (e) {
    let inp = document.querySelector('input[data-input-id="' + e.currentTarget.parentNode.dataset.inputId + '"]');
    if(inp) {
      let val = parseInt(inp.value,10) || 1;
      if (val>1) val--;
      inp.value = val;
      setValidateClasses(inp);
    }
  });

  $('.question-title').on('click',function (e) {
    e.preventDefault();
    let parent = e.currentTarget.parentNode;
    let parentOpened = parent.classList.contains('open');
    document.querySelectorAll('.question-card.open')
        .forEach((el) => el.classList.remove('open') );

    if (!parentOpened) setTimeout(() => parent.classList.add('open'), 300 );
  });

  let fixedHeader = function(){
    let h = $('.header-row-1').outerHeight();
    if ($(window).scrollTop() > h) {
      if (!$('.header-row-1').hasClass('fixed')) {

        $('.header-row-1').offset({top:-h});
        $('.header-row-1').addClass('fixed');

        $('.header-row-1').animate({top : 0},500);

      }
    } else {
      if ($('.header-row-1').hasClass('fixed')) {
        $('.header-row-1').attr('style','');
        $('.header-row-1').removeClass('fixed');
      }
    }

  }

  $(window).on('load scroll', function () {
    fixedHeader();
  });




});