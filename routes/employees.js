var express = require('express');
var router = express.Router();
var async = require('async')
var Employee = require('../models/employee')

router.get('/employees', function(req, res, next) {
  res.send('respond with a resource');
});


// Ading the projects
router.post('/employees/api',function(req, res, next){
        
  let employeeName     = req.body.employeeName; // this would for employee name
  let employeeEmail    = req.body.employeeEmail; // this is for emaployee email
  let employeeNumber   = req.body.employeeNumber; // this is for employee mobile number
  let isManager        = req.body.isManager; // is manager or not, if manager value would be 1 and for not 0 
  let ManagerId        = req.body.ManagerId // please select manager id if not value would be 0
  
  req.checkBody('employeeName', 'please enter the emploayee Name').notEmpty()
     .isLength({min:5, max:30}).withMessage('minmum and maximum size should be 5 and 10 respectivly')
  req.checkBody('employeeEmail', 'please enter the employee Email Time').notEmpty()
     .isEmail().withMessage('please enter the valid email id ')
     .isLength({min:5, max:20}).withMessage('minmum and maximum size should be 5 and 10 respectivly')
  req.checkBody('employeeNumber', 'please enter the mobile number').notEmpty()
     .isLength({min:5, max:20}).withMessage('minmum and maximum size should be 5 and 10 respectivly')
  req.checkBody('isManager', 'please verify is this manager or asscocite').notEmpty()
     .isLength({max:1}).withMessage('minmum and maximum size should be 5 and 10 respectivly')
  req.checkBody('ManagerId', 'assign manager id').notEmpty()
     .isLength({min:0, max:30})
 
  var errors = req.validationErrors();

  // validating the email id wether the user is existed or not
    Employee.findOne({employeeEmail:employeeEmail}, function(err, user){
      if(err){
        return res.status(400)
              .json({status:false, 
                response: err, 
                devMessage: 'there is some issue while finding the data'})
      } else if(user){
        return res.status(400)
              .json({status:false, 
                response: 'your email id is exsited please try with another email', 
                devMessage: 'user aleady existed'})
      }
    })

  if(errors){
    return res.status(400)
              .json({status:false, 
                response: errors, 
                devMessage: 'there is some issue while creating the user data'})
  }else{
      console.log('no here os the issue')
       var newEmployee = new Employee({
           employeeName:employeeName,
          employeeEmail:employeeEmail,
        employeeNumber :employeeNumber,
        isManager:isManager,
        ManagerId:ManagerId
    })    
    Employee.createEmployee(newEmployee, function(err, employeeCreated){
      if(err){
        return res.status(400)
                  .json({status:false, 
                    response:err, 
                    devMessage:'there is some issue while creating the employees'})
      }else{
        return res.status(201)
                  .json({status:true, 
                    response:employeeCreated, 
                    message:'employess created sucessfully'})
      }
    }) 
  }
})

// to get all the employee details
router.get('/getemployee/api', function(req, res){
  Employee.find({}, (err, employee) => {
    if(err){
      return res.status(400)
                  .json({status:false, 
                    response:err, 
                    devMessage:'there is some issue while creating the employees'})
    }else{
      return res.status(201)
                  .json({status:true, 
                    response:employee, 
                    message:'employess created sucessfully'})
    }
    
  })
})



// to get associate details
router.get('/getemployee/api', function(req, res){
  Employee.find({isManager:'0'}, (err, associate) => {
    if(err){
      return res.status(400)
                  .json({status:false, 
                    response:err, 
                    devMessage:'there is some issue while creating the employees'})
    }else{
      return res.status(201)
                  .json({status:true, 
                    response:associate, 
                    message:'employess created sucessfully'})
    }
  })
})




// once you perticular manager view details 
// in this i will show them the manager details and the emploeeys in this manager
// i need the id in params
router.get('/getonemanager/api/:id',(req, res) => {
  
  let id = req.params.id;
  let Man = {}
console.log(id)
  async.parallel({
    managerDet : function(cb){
      Employee.findById(id, cb)
    },
    Empl : function(cb){
      Employee.find({ManagerId:id}, cb)
    }
  },function(err, data){
    if(err || !data){
      return res.status(400)
                  .json({status:false, 
                    response:err,
                    messager:'id is not valid', 
                    devMessage:'there is some issue while get the employees'})
    }else{
      return res.status(201)
                  .json({status:true, 
                    response:data, 
                    message:'employess get sucessfully'})
    }
  })
})





// if you want perticular employee details and want to seee wo is manager
  router.get('/getoneemployee/api/:id', function(req,res){
    console.log('this api called')
    
    let newId = req.params.id
    console.log(newId)
    let Emp = {};
    Employee.letfindById(newId, function(err, data){
      if(err){
        return res.status(400)
                  .json({status:false, 
                    response:err, 
                    devMessage:'there is some issue while get the assocites'})
      }else{
        console.log(data)
        Emp.mydata = data
        let managerId = data.ManagerId

        Employee.letfindById(managerId, function(err, newData){
          if(err){
            return res.status(400)
                  .json({status:false, 
                    response:err, 
                    devMessage:'there is some issue while get the managers'})
          }else{
            Emp.manager = newData

            return res.status(201)
                  .json({status:true, 
                    response:Emp, 
                    message:'employess get sucessfully'})
          }
        })
    }

    })
  })





// to get all the manger details
router.get('/getemployee/api', function(req, res){
  Employee.find({}, (err, employee) => {
    return res.status(201)
                  .json({status:true, 
                    response:employee, 
                    message:'employess created sucessfully'})
  })
})




// updating the data need id the employe a
// and also what data will edit  will get the all the data in post in edit i will get old data only
router.get('/update/api/:id', () => {
  
  let id = req.params.id
  let employeeName     = req.body.employeeName; // this would for employee name
  let employeeEmail    = req.body.employeeEmail; // this is for emaployee email
  let employeeNumber   = req.body.employeeNumber; // this is for employee mobile number
  let isManager        = req.body.isManager; // is manager or not, if manager value would be 1 and for not 0 
  let ManagerId        = req.body.ManagerId // please select manager id if not value would be 0
  
  req.checkBody('employeeName', 'please enter the emploayee Name').notEmpty()
     .isLength({min:5, max:30}).withMessage('minmum and maximum size should be 5 and 10 respectivly')
  req.checkBody('employeeEmail', 'please enter the employee Email Time').notEmpty()
     .isEmail().withMessage('please enter the valid email id ')
     .isLength({min:5, max:20}).withMessage('minmum and maximum size should be 5 and 10 respectivly')
  req.checkBody('employeeNumber', 'please enter the mobile number').notEmpty()
     .isLength({min:5, max:20}).withMessage('minmum and maximum size should be 5 and 10 respectivly')
  req.checkBody('isManager', 'please verify is this manager or asscocite').notEmpty()
     .isLength({max:1}).withMessage('minmum and maximum size should be 5 and 10 respectivly')
  req.checkBody('ManagerId', 'assign manager id').notEmpty()
     .isLength({min:0, max:30})

     
    if(errors){
    return res.status(400)
              .json({status:false, 
                response: errors, 
                devMessage: 'there is some issue while creating the user data'})
      }else{
      console.log('no here os the issue')
       var data = {
           employeeName   :employeeName,
           employeeEmail  :employeeEmail,
           employeeNumber :employeeNumber,
           isManager      :isManager,
           ManagerId      :ManagerId
          }

          Employee.findByIdAndUpdate(id, data, function(err, dataUpdated){
            if(err){
              return res.status(400)
              .json({status:false, 
                response: err, 
                devMessage: 'there is some issue while updating the user data'})
            }else{
              return res.status(201)
              .json({status:false, 
                response: dataUpdated, 
                devMessage: 'sucessfully updated'})
            }

          })
      }
})


// deleting the data 

router.post('/employee/delete/api/:id', function(req, res, next){
    var id = req.params.id

    Employee.findAndDelete(id, function(err, chengedDone){
        if(err){
            res.status(400)
                .json({status: false, 
                  response: 'There is no such employee exixts'})
        }else{
            res.status(200)
               .json({status: true, 

                response: chengedDone,
                devMessage:'the employee has been deleted sucessfulll' })
        }
    })
})


module.exports = router;
