
var socket = io();

function validateMessage(message) {
  var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  if (message === '' || format.test(message)) {
    return false
  }
  else {
    return true
  }
}

var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

socket.on('connect', () => {
});

//Sign Up User
jQuery('#signupform').on('submit', function (event) {
  event.preventDefault();
  var username = jQuery('[name=signupusername]').val();
  var email = jQuery('[name=signupuseremail]').val();
  var password1 = jQuery('[name=password1]').val();
  var password2 = jQuery('[name=password2]').val();

  if (!validateMessage(username)) {
    jQuery('#username-msg').text('Username can not contain special charcters or null');
    return;
  }
  else if (username.length < 6) {
    jQuery('#username-msg').text('Username must contain 6 characters');
    return;
  }
  else if (!emailRegex.test(String(email).toLowerCase())) {
    jQuery('#email-msg').text('Email is not Valid');
    return;
  }
  else if (password1.length < 6) {
    jQuery('#password-msg').text('Password Length must be 6 Characters');
    return;
  }
  else if (password1 !== password2) {
    jQuery('#password-msg').text('Passwords are not matching');
    return;
  }
  else {
    var data = {
      username: username,
      email: email.toLowerCase(),
      password: password1
    }
    socket.emit('saveuser', data, function (message) {
      jQuery('#username-msg').text('');
      jQuery('#email-msg').text('');
      jQuery('#password-msg').text('');
      jQuery('#signupform').trigger('reset');
      if (message === 'done') {
        jQuery('#singupform-msg').removeClass('text-danger');
        jQuery('#singupform-msg').addClass('text-success');
        jQuery('#singupform-msg').text('You have successfully Signed Up. Please Sign In with your Credentials');
      }
      else if (message.includes('username_1')) {
        jQuery('#singupform-msg').addClass('text-danger');
        jQuery('#singupform-msg').text('Username is already taken.');
      }
      else if (message.includes('email_1')) {
        jQuery('#singupform-msg').addClass('text-danger');
        jQuery('#singupform-msg').text('Email is already taken.');
      }
      else {
        jQuery('#singupform-msg').addClass('text-danger');
        jQuery('#singupform-msg').text('Something went wrong please try after sometime.');
      }
    })
  }
})

jQuery('#signupform').on('reset', function (event) {
  jQuery('#username-msg').text('');
  jQuery('#email-msg').text('');
  jQuery('#password-msg').text('');
  jQuery('#singupform-msg').text('');
})


//Sign InUser
jQuery('#signinform').on('submit', function (event) {
  var username = jQuery('[name=username]').val();
  var password = jQuery('[name=password]').val();

  if (!validateMessage(username)) {
    event.preventDefault();
    jQuery('#loginusername-msg').text('Your Username must not contain special charcters or null');
    return;
  }
  else if (username.length < 6) {
    event.preventDefault();
    jQuery('#loginusername-msg').text('Your Username must have been 6 characters long');
    return;
  }
  else if (password.length < 6) {
    event.preventDefault();
    jQuery('#loginpassword-msg').text('Your password must have been 6 charcters long');
    return;
  }
})
jQuery('#signinform').on('reset', function (event) {
  jQuery('#loginusername-msg').text('');
  jQuery('#loginpassword-msg').text('');
})

//forgotCredentials
jQuery('#forgotform').on('submit', function (event) {
  event.preventDefault();
  var email = jQuery('[name=forgotemail]').val().toLowerCase();
  if (!emailRegex.test(String(email))) {
    jQuery('#forgotemail-msg').text('Please Enter a valid Email');
    return;
  }
  socket.emit('forgetcred', { email }, function (message) {
    jQuery('[name=forgotemail]').val('');
    if (message === 'Message Sent') {
      jQuery('#forgotemail-msg').text('A Email has been sent with your Credentials.');
    }
    else {
      jQuery('#forgotemail-msg').text('Provided Email Id does not match with any records');
    }
  });
});

jQuery('#forgotform').on('reset', function (event) {
  jQuery('#forgotemail-msg').text('');
});


/** Change Password */
jQuery('#changepasswordform').on('submit', function (event) {
  event.preventDefault();
  var email = jQuery('[name=userupdateemail]').val();
  var oldpassword = jQuery('[name=oldpassword]').val();
  var newpassword = jQuery('[name=newpassword]').val();

  if (!emailRegex.test(String(email).toLowerCase())) {
    jQuery('#pass-msg').text('Please Enter a valid Email');
    return;
  }
  else if (oldpassword.length < 6 || newpassword.length < 6) {
    jQuery('#pass-msg').text('Length of passwords must be 6 charcaters');
    return;
  }
  else if (oldpassword === newpassword) {
    jQuery('#pass-msg').text('Please Enter a different password than old one.');
    return;
  }
  socket.emit('changepassword', { email: email.toLowerCase(), oldpassword, newpassword }, function (message) {
    jQuery('[name=userupdateemail]').val('');
    jQuery('[name=oldpassword]').val('');
    jQuery('[name=newpassword]').val('');
    if (message === 'done') {
      jQuery('#final-msg').removeClass('text-danger');
      jQuery('#final-msg').addClass('text-success');
      jQuery('#final-msg').text('Your Password has been changed');
    }
    else if (message === 'Invalid') {
      jQuery('#final-msg').addClass('text-danger');
      jQuery('#final-msg').text('Your Password is not matching. Please provide correct password');
    }
    else {
      jQuery('#final-msg').addClass('text-danger');
      jQuery('#final-msg').text('Something went Wrong. Please try after sometime');
    }
  });
});

jQuery('#changepasswordform').on('reset', function (event) {
  jQuery('#pass-msg').text('');
  jQuery('#final-msg').text('');
});

//Communcation Address

jQuery('#communicationform').on('submit', function (event) {
  event.preventDefault();
  name = jQuery('[name=name]').val();
  number = jQuery('[name=number]').val();
  address = jQuery('[name=address]').val();
  zipcode = jQuery('[name=zipcode]').val();

  total = jQuery('[name=carttotal]').text();

  completeAddress = ` ${name},
  ${address}
  Pincode: ${zipcode}
  Contact Number: ${number}
    `
  socket.emit('addressadded', { completeAddress, total });
  window.location.href = '/payment'
});

//deletion of items
var ditems = jQuery('[name=deletebutton]').attr('data');
if (window.location.pathname === "/checkout" && ditems !== undefined) {
  ditems = JSON.parse(ditems);
  for (i = 0; i < ditems.length; i++) {
    jQuery('#' + ditems[i]._id).on('click', function (event) {
      var _id = ditems[i]._id;
      socket.emit('deletefromcart', { _id }, function (message) {
        if (message === 'done') {
          jQuery('#showSuccessMsgButton').click();
          setTimeout(function () {
            jQuery('#showSuccessMsgButton').click();
          }, 2000);
          window.location.reload();
        }
        else {
          alert('Something went wrong. Please try after sometime');
        }
      });
    })
  }

}

/**Adding to Cart */

/**Movies */
var movies = jQuery('#moviecol').children('div').children('div').children('div').children('button');
var movieIds = [];
for (i = 0; i < movies.length; i++) {
  movieIds.push('#' + movies[i].getAttribute('id'))
}
for (j = 0; j < movieIds.length; j++) {
  jQuery(movieIds[j]).on('click', function (event) {
    event.preventDefault();
    var data = JSON.parse(this.getAttribute('data'));
    data.quantity = 1
    socket.emit('addtocart', data, function (message) {
      if (message === 'nouser') {
        jQuery('#signin').click();
      }
      else if (message === 'done') {
        jQuery('#showSuccessMsgButton').click();
        setTimeout(function () {
          jQuery('#showSuccessMsgButton').click();
        }, 2000);
      }
      else {
        alert('Something Went wrong. Please try after sometime');
      }
    });
  });
}

/**Movies End */

/**Music */
var music = jQuery('#musiccol').children('div').children('div').children('div').children('button');
var musicIds = [];
for (i = 0; i < music.length; i++) {
  musicIds.push('#' + music[i].getAttribute('id'))
}
for (j = 0; j < musicIds.length; j++) {
  jQuery(musicIds[j]).on('click', function (event) {
    event.preventDefault();
    var data = JSON.parse(this.getAttribute('data'));
    data.quantity = 1
    socket.emit('addtocart', data, function (message) {
      if (message === 'nouser') {
        jQuery('#signin').click();
      }
      else if (message === 'done') {
        jQuery('#showSuccessMsgButton').click();
        setTimeout(function () {
          jQuery('#showSuccessMsgButton').click();
        }, 2000);
      }
      else {
        alert('Something Went wrong. Please try after sometime');
      }
    });
  });
}

/**Music End */

/**Access */
var access = jQuery('#accesscol').children('div').children('div').children('div').children('button');
var accessIds = [];
for (i = 0; i < access.length; i++) {
  accessIds.push('#' + access[i].getAttribute('id'))
}
for (j = 0; j < accessIds.length; j++) {
  jQuery(accessIds[j]).on('click', function (event) {
    event.preventDefault();
    var data = JSON.parse(this.getAttribute('data'));
    data.quantity = 1
    socket.emit('addtocart', data, function (message) {
      if (message === 'nouser') {
        jQuery('#signin').click();
      }
      else if (message === 'done') {
        jQuery('#showSuccessMsgButton').click();
        setTimeout(function () {
          jQuery('#showSuccessMsgButton').click();
        }, 2000);
      }
      else {
        alert('Something Went wrong. Please try after sometime');
      }
    });
  });
}

/**Access End */

function changeaddress() {
  jQuery('#addresstext').removeAttr('disabled')
  jQuery('#changeaddress').addClass('d-none');
  jQuery('#saveaddress').removeClass('d-none');
}
function saveaddress() {
  jQuery('#addresstext').attr('disabled', 'disabled')
  jQuery('#changeaddress').removeClass('d-none');
  jQuery('#saveaddress').addClass('d-none');
}

/** Promocode Section */
var count = 0;
function promocode() {
  promo = jQuery('[name=promocode]').val();
  orderTotal = jQuery('#totalpay').text();
  if (promo === '') {
    jQuery('#promoerr').addClass('text-danger');
    jQuery('#promoerr').text('Please Enter a Promocode First')
    setTimeout(function () {
      jQuery('#promoerr').removeClass('text-danger');
      jQuery('#promoerr').text('')
    }, 2000);
  }
  else if (promo !== 'FIRST10') {
    jQuery('#promoerr').addClass('text-danger');
    jQuery('#promoerr').text('Please Enter a valid promocode')
    setTimeout(function () {
      jQuery('#promoerr').removeClass('text-danger');
      jQuery('#promoerr').text('');
      jQuery('[name=promocode]').val('');
    }, 2000);
  }
  else if (count === 1) {
    jQuery('#promoerr').addClass('text-danger');
    jQuery('#promoerr').text('you have already used this promocode')
    setTimeout(function () {
      jQuery('#promoerr').removeClass('text-danger');
      jQuery('#promoerr').text('');
      jQuery('[name=promocode]').val('');
    }, 2000);
  }
  else {
    count = 1;
    total = parseInt(orderTotal, 10);
    total = total - (total * 0.10);
    jQuery('#promoerr').addClass('text-primary');
    jQuery('#promoerr').text('Promocode Successfully Applied');
    jQuery('#totalpay').text(total);
    setTimeout(function () {
      jQuery('#promoerr').removeClass('text-success');
      jQuery('#promoerr').text('');
      jQuery('[name=promocode]').val('');
    }, 2000);
  }
}


//Make Payment

function makepayment() {
  window.location.href = '/congratulations'
}


function paycash() {
  jQuery('#collapse1').removeClass('show');
  jQuery('#collapse2').removeClass('show');
}

function paypaytm() {
  jQuery('#collapse1').removeClass('show');
  jQuery('#collapse3').removeClass('show');
}

function paycard() {
  jQuery('#collapse2').removeClass('show');
  jQuery('#collapse3').removeClass('show');
}

socket.on('disconnect', () => {
});