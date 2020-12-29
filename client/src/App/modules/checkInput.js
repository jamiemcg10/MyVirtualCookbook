// functions to validate user input

// public functions
function hasInjection(text){ 
    if (isAdmin(text)){
        return true;
    } 

    if (hasDollarSign(text)){
        return true;
    }

    return false;
}

function isValidEmail(email){
    // checks to make sure there is an @ symbol and a . in that order
    if (email.length === 0){
        return false;
    }

    if (!containsOnlyAlphaNumericDashPeriodAt(email)){
        return false;
    }

    if ( !((email.indexOf(".") > -1 && email.indexOf("@") >-1) && 
            email.lastIndexOf(".") > email.indexOf("@")) &&
            email.lastIndexOf(".") < email.length-1)
        {
        console.log("bad formatting");
        // does not contain . and @
        // there is not a . after @
        // ends in in .
        return false;
    }

    return true;
}

function isValidPassword(password){
    if (!containsOnlyAlphaNumeric(password)){
        return false;
    }

    if (password.length < 6){
        return false;
    }

    return true;
}

function isValidItemName(item){
    if (item.length === 0){
        return false;
    } 
    
    if (!containsOnlyAlphaNumericDash(item)){
        return false;
    } 

    return true;
}

function isValidLink(link){
    if (link.length === 0){
        return false;
    }

    let validLink = RegExp("^(http://|https://|http://www.|https://www.|www.){1}[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$");
    if (!validLink.test(link)){
        return false;
    }

    return true;
}

/// private functions
function isAdmin(text){
    if (text.toLowerCase() === 'admin'){
        return true;
    }

    return false;
}

function hasDollarSign(text){
    if (text.toLowerCase().indexOf('$') >= 0) {
        return true;
    }

    return false;
}



function containsOnlyAlphaNumeric(string){
    let invalidString = RegExp(/\W/);

    if (!invalidString.test(string)){
        return true;
    }

    return false;
}

function containsOnlyAlphaNumericDash(string){
    // also allows space and apostrophe and double quotes
    let validString = RegExp(/^[\w- '"]*$/);

    if (!validString.test(string)){
        return false;
    }

    return true;
}

function containsOnlyAlphaNumericDashPeriodAt(string){
    let validString = RegExp(/^[\w-.@]*$/);

    if (!validString.test(string)){        
        return false;
    }

    return true;
}


module.exports = {
    isValidEmail: isValidEmail,
    isValidPassword: isValidPassword,
    isValidItemName: isValidItemName,
    isValidLink: isValidLink,
    hasInjection: hasInjection
}