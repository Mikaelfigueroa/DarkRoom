let functions = {}



functions.capitalize = function(v){
    return v.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}


functions.mongooseFormat = function(v){
    if(typeof v ==="object"){
      if(v.name == "UserExistsError"){
        return v.message
      }
      if(v.code==11000){
        return "Email is already associated with a account"
      }
      var a = Object.keys(v.errors)[0]
      return v.errors[a].message
    }
    else{
        return v
    }
}



module.exports = functions;
