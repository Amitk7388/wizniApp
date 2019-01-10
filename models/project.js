const mongoose = require('mongoose');

let projectSchema = mongoose.Schema({
    projectName       :{
        type: String,
        index:true,
        required : true,
        minlength : 5,
        maxlength : 40,
    },
    projectStartDate  :{
        type      : String,
        required  : true,
        minlength : 5,
        maxlength : 40,
    },
    projectEndDate    :{
        type      : String,
        required  : true,
        minlength : 5,
        maxlength : 40,
    },
    projectDetails    :{
        type      : String,
        required  : true,
        minlength : 5,
        maxlength : 40,
    },
    projectManagerId    :{
        type      : String,
        required  : true,
        minlength : 5,
        maxlength : 40,
    },
    projectDescription:{
        type      : String,
        required  : true,
        minlength : 5,
        maxlength : 40,
    },
    employeeArryList:[{
        type      : String,
        required  : true,
        minlength : 5,
        maxlength : 200,
    }]
})    


var Project = module.exports = mongoose.model('project', projectSchema)

module.exports.createProject = function(newProject, cb){
                    newProject.save(cb)
}


module.exports.findAndDelete = function(id, cb){
    Project.findByIdAndDelete(id, cb)

}
 
module.exports.letfindById = function(id, cb){
    Project.findById(id, cb)
}

