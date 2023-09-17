import { HttpErrors } from '../helpers/index.js';
import Contact from '../models/Contact.js';

const checkContactOwnership = async (req, res, next) => {
   const contactId = req.params.contactId;
   const {_id: owner} = req.user;
 
   try {
     const contact = await Contact.exists({ _id: contactId, owner });
 
     if (!contact) {
       throw HttpErrors(404);
     }
 
     next();
   } catch (error) {
     next(error);
   }
 };

 export default checkContactOwnership;