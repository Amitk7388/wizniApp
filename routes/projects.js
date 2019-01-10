var express = require('express');
var router = express.Router();

var Project = require('../models/project')
var Employee = require('../models/employee')


// From here you can add the projects 

router.post('/projects/api',function(req, res, next){
  // taking the varaible of req.body        
  let projectName         = req.body.projectName;
  let projectStartDate    = req.body.projectStartDate;
  let projectEndDate      = req.body.projectEndDate;
  let projectDetails      = req.body.projectDetails;
  let projectManagerId    = req.body.projectManagerId;
  let projectDescription  = req.body.projectDescription;
  let employeeArryList    = req.body.employeeArryList

  // taking value into array and spliting by ', '
  let newEmployeeArryList = employeeArryList.split(', ')

  // validating through express validator
  req.checkBody('projectName', 'please enter the project Name').notEmpty()
     .isLength({min:5, max:30}).withMessage('min and maximum size should be 5 and 30 respectively')
  req.checkBody('projectStartDate', 'please enter the start Time').notEmpty()
     .isLength({min:5, max:20}).withMessage('min and maximum size should be 5 and 20 respectively')
  req.checkBody('projectEndDate', 'please enter the end Time').notEmpty()
     .isLength({min:5, max:20}).withMessage('min and maximum size should be 5 and 20 respectively')
  req.checkBody('projectDetails', 'please enter the project Details').notEmpty()
     .isLength({min:5, max:40}).withMessage('min and maximum size should be 5 and 40 respectively')
  req.checkBody('projectManagerId', 'please enter the project Manager name').notEmpty()
     .isLength({min:5, max:30}).withMessage('min and maximum size should be 5 and 30 respectively')
  req.checkBody('projectDescription', 'please enter the short Disription').notEmpty()
     .isLength({min:5, max:80}).withMessage('min and maximum size should be 5 and 80 respectively')
  
  // this is for the passing the errors   
  var errors = req.validationErrors();

  if(errors){
    return res.status(400)
              .json({status:false, 
                response: errors, 
                devMessage: 'there is some issue while creating the user data'})
  }else{
    console.log('no here os the issue')
    var newProject = new Project({
      projectName       : projectName,
      projectStartDate  : projectStartDate,
      projectEndDate    : projectEndDate,
      projectDetails    : projectDetails,
      projectManagerId  : projectManagerId, 
      projectDescription: projectDescription,
      employeeArryList  : newEmployeeArryList
    })    
    Project.createProject(newProject, function(err, projectCreated){
      if(err){
        return res.status(400)
                  .json({status:false, 
                    response:err, 
                    devMessage:'there is some issue while created project object'})
      }else{
        return res.status(201)
                  .json({status:true, 
                    response:projectCreated, 
                    message:'project created sucessfully'})
      }
    }) 
  }
})


//from this it will show the details of the Project just for the demo purpose
// frontend developer will show to user from this data will ==
//project name, Start Time, End Time
// to know all the details of the perticular project users has to click on the View Details button
// and while cliking it will route to /project/getdata/:id that button the frontend developer has to send me the Id of the project 
// and i will show them the perticular project with all details 

router.get('/projects/get/api/', function(req, res){
  Project.find({}, function(err, data){
    if(err){
      return res.status(400)
                .json({status:false,
                response: err,
              devMessage: 'there is some issue while geting the data'})
    }else{
      return res.status(200)
                .json({status:true,
                response: data,
              devMessage: 'there is some issue while geting the data'})
    }
  })
})







//Once you will click on view all, it will show all the details and give to you
router.get('/project/getdata/:id', function(req, res){
  let projectId = req.params.id // taking the id from url
  
  // creating the object where all the detail will show of the project
  let newObject ={
    Project:{},
    Manager:{},
    Employee:[],
}
  Project.letfindById(projectId, function(err, data){
    if(err || !data){
      return res.status(400)
                .json({status:false,
                response: err,
                message:'id is not valid',
              devMessage: 'there is some issue while geting the data'})
    }else{
      newObject.Project = data

      let newData = data.projectManagerId 
      Employee.letfindById(newData, function(err, data){
        if(err || !data){
          return res.status(400)
                .json({status:false,
                response: err,
                message:'id is not valid',
              devMessage: 'there is some issue while geting the data'})
        }
         else{
          newObject.Manager = data
        }
      })
        let finalData = data.employeeArryList[0]
        finalData1 = finalData.split(',') //taking the value in array and spliting by (',')
        Employee.find({ "_id": { "$in": finalData1 } },function(err,docs) {
            if(err){
              return res.status(400)
                        .json({status:false, 
                          response:err, 
                          devMessage:'there is some issue while finding the data '})
            }else{
               docs.forEach(element => {
                newObject.Employee.push(element)
                });
             
             return res.status(201)
                        .json({status:true, 
                          response:newObject, 
                          devMessage: 'here is the result'})
            }
        });
    }  
  })
})




// deleting the data

router.post('/project/delete/api/:id', function(req, res, next){
    var id = req.params.id

    Project.findAndDelete(id, function(err, chengedDone){
        if(err){
            res.status(400)
                .json({status: false, 
                  response: 'There is no such project exixts'})
        }else{
            res.status(200)
               .json({status: true, 
                response: chengedDone,
                devMessage: 'the projecct has been deleted sucessfulll' })
        }
    })
})







// this is for the updating all the details of the form
// how this will work, first user will get form in that user will edit and what ever not edit the user it have same value
// and i will take all the value from the form and i will update it 
// from that for all details must be there this will done by frontend developer

router.post('/project/update/api/:id', function(req, res){
  let projectId = req.params.id 

  let projectName        = req.body.projectName;
  let projectStartDate   = req.body.projectStartDate;
  let projectEndDate     = req.body.projectEndDate;
  let projectDetails     = req.body.projectDetails;
  let projectManagerId   = req.body.projectManagerId;
  let projectDescription = req.body.projectDescription;
  let employeeArryList   = req.body.employeeArryList
  
  let newEmployeeArryList = employeeArryList.split(', ')

  // validating through express validator
  req.checkBody('projectName', 'please enter the project Name').notEmpty()
     .isLength({min:5, max:30}).withMessage('min and maximum size should be 5 and 30 respectively')
  req.checkBody('projectStartDate', 'please enter the start Time').notEmpty()
     .isLength({min:5, max:20}).withMessage('min and maximum size should be 5 and 20 respectively')
  req.checkBody('projectEndDate', 'please enter the end Time').notEmpty()
     .isLength({min:5, max:20}).withMessage('min and maximum size should be 5 and 20 respectively')
  req.checkBody('projectDetails', 'please enter the project Details').notEmpty()
     .isLength({min:5, max:40}).withMessage('min and maximum size should be 5 and 40 respectively')
  req.checkBody('projectManagerId', 'please enter the project Manager name').notEmpty()
     .isLength({min:5, max:30}).withMessage('min and maximum size should be 5 and 30 respectively')
  req.checkBody('projectDescription', 'please enter the short Disription').notEmpty()
     .isLength({min:5, max:80}).withMessage('min and maximum size should be 5 and 80 respectively')

     let errors = req.validationErrors();

     if(errors){
    return res.status(400)
              .json({status:false, 
                response: errors, 
                devMessage: 'there is some issue while creating the user data'})
      }else{
        let data = {projectName : projectName,
      projectStartDate  : projectStartDate,
      projectEndDate    : projectEndDate,
      projectDetails    : projectDetails,
      projectManagerId  : projectManagerId, 
      projectDescription: projectDescription,
      employeeArryList  : newEmployeeArryList}

        Project.findByIdAndUpdate(projectId, data, function(err, dataUpdated){
            if(err){
              return res.status(400)
                        .json({status:false, 
                          response:err})
            }else{
              return res.status(201)
                        .json({status:false, 
                          response:dataUpdated,
                          devMessage:'data updated sucessfully'})
            }
        })
  }

})

module.exports = router;
