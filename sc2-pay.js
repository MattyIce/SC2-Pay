var sc2_pay = (function() {
  var dialog_html =
    '<div id="sc2_pay_dialog" class="modal fade" tabindex="-1" role="dialog">' +
      '<div class="modal-dialog" role="document">' +
        '<div class="modal-content">' +
          '<div class="modal-header">' +
            '<span class="close" data-dismiss="modal" aria-hidden="true">X</span>' +
            '<h2>{sc2_pay_title}</h2>' +
          '</div>' +
          '<div class="modal-body">' +
              '<iframe frameborder="0" src="{sc2_pay_url}" style="border: none;" width="500" height="560"></iframe>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  function format(n, c, d, t){
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,  // decimal point
        t = t == undefined ? "" : t,  // thousands separator
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
       return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  }

  var dialog = null;
  function requestPayment(title, to, amount, currency, memo, callback) {
    if(currency != 'STEEM' && currency != 'SBD') {
      console.log('Unsupported currency "' + currency + '". Supported currencies are "STEEM" or "SBD".');
      return;
    }

    var url = sc2.sign('transfer', {
      to: to,
      amount: format(amount, 3) + ' ' + currency,
      memo: memo
    });

    dialog = $(dialog_html.replace('{sc2_pay_title}', title).replace('{sc2_pay_url}', url));
    $(document.body).append(dialog);
    dialog.on('hidden.bs.modal', function() { cancel_check = true; });
    dialog.modal('show');
    checkSteemTransfer(to, amount, currency, memo, new Date(), callback);
  }

  function getCurrency(amount) {
    return amount.substr(amount.indexOf(' ') + 1);
  }

  var cancel_check = false;
  function checkSteemTransfer(to, amount, currency, memo, date, callback) {
      if (cancel_check) {
          cancel_check = false;

          if (callback)
              callback(null);

          return;
      }

      console.log('Checking Steem Transfer...' + memo + ', amount: ' + amount + ' ' + currency);

      steem.api.getAccountHistory(to, -1, 10, function (err, result) {
        var confirmed = false;

        for (var i = 0; i < result.length; i++)
        {
          var trans = result[i];
          var op = trans[1].op;
          var ts = new Date((trans[1].timestamp) + 'Z');

          if (ts > date && op[1].memo == memo && op[0] == 'transfer' && op[1].to == to && parseFloat(op[1].amount) == amount && getCurrency(op[1].amount) == currency) {
            confirmed = true;

            if(dialog)
              dialog.modal('hide');

            if(callback)
              callback(trans);

            break;
          }
        }

        if (!confirmed)
          setTimeout(function () { checkSteemTransfer(to, amount, currency, memo, date, callback); }, 2000);
      });
  }

  return { requestPayment: requestPayment };
})();
