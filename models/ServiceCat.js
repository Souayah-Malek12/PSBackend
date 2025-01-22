const mongoose = require("mongoose")

const ServcieCatSchema = mongoose.Schema({
  
        name : {
            type:String,
            required : true,
            /*enum: [
                "Plomberie",
                "Menuiserie",
                "Jardinage",
                "Electricien",
                "Mécanicien",
                "Maçon",
                "Peintre",
                "Toiture",
                "Vitreur",
                "Forgeron",
                "Service Client",
                "Client",
                "Administrator",
            ]*/
        },
    
})

module.exports = mongoose.model("ServiceCategory", ServcieCatSchema);