var errorUnknown = -1;
var errorNotFoundPage = -2;
var errorWallet = -3;
var errorApiDown = -4;

function reloadStats() {
    return $.ajax({
        url: apiHostUrl + 'stats',
        type: 'get',
        dataType: 'json',
        cache: false,
        crossDomain: true,
        success: function (data) {
            refreshStats(data);
            setTimeout(reloadStats, 5000);
        },
        error: function (request,status,error) {
            if(request.status == 404)
                showErrorMessage(errorApiDown);
            else
                showErrorMessage(errorUnknown);

            setTimeout(reloadStats, 30000);
        }
    });
}

function reloadHost() {
    return $.ajax({
        url: 'http://esn-chart.topmining.co.kr:8181/cpu/get_cpu_stats.php',
        type: 'get',
        dataType: 'json',
        cache: false,
        crossDomain: true,
        success: function (data) {
            refreshHost(data);
            setTimeout(reloadHost, 30000);
        },
        error: function (request,status,error) {
            if(request.status == 404)
                showErrorMessage(errorApiDown);
            else
                showErrorMessage(errorUnknown);

            setTimeout(reloadHost, 30000);
        }
    });
}

function reloadBlocks() {
    return $.ajax({
        url: apiHostUrl + 'blocks',
        type: 'get',
        dataType: 'json',
        cache: false,
        crossDomain: true,
        success: function (data) {
            refreshBlocks(data);
            setTimeout(reloadBlocks, 10000);
        },
        error: function (request,status,error) {
            if(request.status == 404)
                showErrorMessage(errorApiDown);
            else
                showErrorMessage(errorUnknown);

            setTimeout(reloadBlocks, 30000);
        }
    });
}

function reloadPaymets() {
    return $.ajax({
        url: apiHostUrl + 'payments',
        type: 'get',
        dataType: 'json',
        cache: false,
        crossDomain: true,
        success: function (data) {
            refreshPayments(data);
            setTimeout(reloadPaymets, 10000);
        },
        error: function (request,status,error) {
            if(request.status == 404)
                showErrorMessage(errorApiDown);
            else
                showErrorMessage(errorUnknown);

            setTimeout(reloadPaymets, 30000);
        }
    });
}

function reloadMiners() {
    return $.ajax({
        url: apiHostUrl + 'miners',
        type: 'get',
        dataType: 'json',
        cache: false,
        crossDomain: true,
        success: function (data) {
            refreshMiners(data);
            setTimeout(reloadMiners, 10000);
        },
        error: function (request,status,error) {
            if(request.status == 404)
                showErrorMessage(errorApiDown);
            else
                showErrorMessage(errorUnknown);

            setTimeout(reloadMiners, 30000);
        }
    });
}

var currentReloadAccount = "";
function reloadAccount(account) {
    currentReloadAccount = account;
    return reloadAccountLoop();
}

function reloadAccountLoop() {
    var account = currentReloadAccount;
    return $.ajax({
        url: apiHostUrl + 'accounts/' + account,
        type: 'get',
        dataType: 'json',
        cache: false,
        crossDomain: true,
        success: function (data) {
            refreshAccount(data);
            setTimeout(reloadAccountLoop, 5000);
        },
        error: function (request,status,error) {
            if(request.status == 404)
                showErrorMessage(errorWallet);
            else
                showErrorMessage(errorUnknown);

            setTimeout(reloadAccountLoop, 30000);
        }
    });
}

function weiToEther(value, fixed) {
    var ether = value * 0.000000000000000001;
    return ether.toFixed(fixed);
}

function gweiToEther(value, fixed) {
    var ether = value * 0.000000001;
    return ether.toFixed(fixed);
}

function formatHashrate(hashrate, nospace) {
    hashrate *= 1;  // Convert to numeric
    var i = 0;
    var units = ['H', 'KH', 'MH', 'GH', 'TH', 'PH'];
    while (hashrate > 1000) {
    hashrate = hashrate / 1000;
        i++;
    }
    return hashrate.toFixed(2) + (nospace ? '' : ' ') + '<small>' + units[i] + "</small>";
}

function formatDifficulty(value, nospace) {
    value *= 1;  // Convert to numeric
    if (value < 1000) {
        return value;
    }

    var i = 0;
    var units = ['K', 'M', 'G', 'T', 'P'];
    while (value > 1000) {
        value = value / 1000;
        i++;
    }
    return value.toFixed(3) + (nospace ? '' : ' ') + '<small>' + units[i - 1] + "</small>";
}

function formatCurrency(value) {
    var strValue = value.toString();

    if(strValue.indexOf(".") >= 0)
        return strValue.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    else
        return strValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatPrettyDate(value, messages) {
    var floor = Math.floor,
    second = 1000,
    minute = 60 * second,
    hour = 60 * minute,
    day = 24 * hour,
    week = 7 * day,
    month = 31 * day,
    year = 365 * day;

    var diff = Date.now() - value;
    var past = diff > 0 ? true : false;
    diff = diff < 0 ? (second - diff) : diff;

    var prettyDate = (
        diff < 2 * second ? messages.second :
        diff < minute ? messages.seconds.replace("%s", floor(diff / second)) :
        diff < 2 * minute ? messages.minute :
        diff < hour ? messages.minutes.replace("%s", floor(diff / minute)) :
        diff < 2 * hour ? messages.hour :
        diff < day ? messages.hours.replace("%s", floor(diff / hour)) :
        diff < 2 * day ? (past ? messages.yesterday : messages.tomorrow) :
        diff < 3 * day ? (past ? messages.beforeYesterday : messages.afterTomorrow) :
        diff < week ? messages.days.replace("%s", floor(diff / day)) :
        diff < 2 * week ? messages.week :
        diff < 4 * week ? messages.weeks.replace("%s", floor(diff / week)) :
        diff < 2 * month ? messages.month :
        diff < year ? messages.months.replace("%s", floor(diff / month)) :
        diff < 2 * year ? messages.year : messages.years.replace("%s", floor(diff / year))
    );

    prettyDate = prettyDate.replace("%s", past ? messages.beforeSuffix : messages.afterSuffix);

    return prettyDate;
}
