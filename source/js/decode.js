function getPassword() {
  var orig_pass = prompt("Please enter password", "");
  if (orig_pass != null && orig_pass != "")
      var password = new Array(orig_pass.length);
  for (i = 0; i < orig_pass.length; i++) {
      password[i] = orig_pass.charCodeAt(i);
  }
  return password;
}

function zubragDecode(encodedHTML, expected, correctBlock, errorBlock) {
  var password = getPassword();
  var orig = unescape(encodedHTML);
  orig = orig.split("");

  var passnum = orig.length % password.length;
  for (i = orig.length - 1; i >= 0; i--) {

      passnum--;
      if (passnum == -1) passnum = password.length - 1;

      var pos1 = i;
      var pos2 = i + password[passnum];

      if (pos2 >= orig.length) continue;

      char1 = orig[pos1];
      char2 = orig[pos2];

      orig[pos2] = char1;
      orig[pos1] = char2;

  }

  var orig1 = "";
  for (i = 0; i < orig.length; i++) {
      orig1 = orig1 + orig[i];
  }
  orig1 = orig1.replace(/mmm/g, "\r\n").trim();

  if (orig1.startsWith(expected)){
    $('#' + correctBlock).html(orig1);
    $('#' + errorBlock).hide();
  }
  else{
      $('#' + errorBlock).html("<center><strong>Not Quite</strong></center>");
      $('#' + errorBlock).show();
  }
}