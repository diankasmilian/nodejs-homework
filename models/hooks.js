export const handleSaveError = (error, data, next) => {
   const {name, code} = error;
   const status = (name === 'MongoServerError' && code === 11000 ? 409 : 404);
   error.status = status;
   next()
}

export const runValidateAtUpdate = function(next) {
   this.options.runValidators = true;
   next()
 }