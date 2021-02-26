
var checkBox = document.querySelector('#agreeBox');
var acceptBtn = document.querySelector('#acptBtn');
var extBtn = document.querySelector('#extBtn');
var iframe = document.querySelector('#respIfrm');



iframe.contentWindow.onscroll = function () {
  if ((iframe.contentWindow.innerHeight + iframe.contentWindow.scrollY) > iframe.contentWindow.document.body.offsetHeight) {
    checkBox.disabled = false;
    acceptBtn.style.background = '#D0D700'
  }
};

checkBtn = function () {
  var checkBox = document.querySelector('#agreeBox');
  if (checkBox.checked) {
    acceptBtn.style.background = '#007934'
  } else {
    acceptBtn.style.background = '#D0D700'

  }
}

exit = function () {
  var extBtn = document.querySelector('#extBtn');
  extBtn.style.background = 'none'
  extBtn.style.color = 'black'
}