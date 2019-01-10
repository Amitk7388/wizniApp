const mongoose = require('mongoose');

let employeeSchema = mongoose.Schema({
    employeeName:{
        type: String,
        index:true,
        required : true,
        
    },
  employeeEmail:{
    type: String,
        required : true,
        
  },
  employeeNumber: {
    type: String,
        required : true,
        
  },
  isManager:{
        type: String,
        required : true,
        
  },
  ManagerId:{
        type:String,
        required : true
  }

})    


var Employee = module.exports = mongoose.model('employee', employeeSchema)

module.exports.createEmployee = function(newEmployee, cb){
                    newEmployee.save(cb)
}


module.exports.findAndDelete = function(id, cb){
    Project.findByIdAndDelete(id, cb)

}

module.exports.letfindById = function(id, cb){
    Employee.findById(id, cb)
}

// module.exports.findByEmail = function({employeeEmail:employeeEmail}, cb){
//     Employee.findOne(email, cb)
// }