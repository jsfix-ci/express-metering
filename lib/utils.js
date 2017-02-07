exports.getUTCHourIndex = function (date) {
    var isoDateString = null;

    if(typeof date == 'string'){
        date = new Date(date);
    }
    if( !(date instanceof Date) || isNaN( date.getTime()) ){
        throw new Error('invalid date input');
    }

    return date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+'/'+date.getUTCHours();
};

// https://gist.github.com/jasonrhodes/2321581
exports.getDescendantProp = function(obj, desc) {
    var arr = desc.split('.');
    while (arr.length && (obj = obj[arr.shift()]));
    return obj;
};