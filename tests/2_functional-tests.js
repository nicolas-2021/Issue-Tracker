const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
require('../db-connection.js');
chai.use(chaiHttp);
let issue1;
suite('Functional Tests', function() {
  suite('3 POST request', function(){
    test('Create an issue with every field: POST request to /api/issues/{project}',function(done){
      chai
      .request(server)
      .keepOpen()
      .post('/api/issues/testing123')
      .send({
          issue_title: "issue 1",
          issue_text: "functional test",
          created_by: "FCC",
          assigned_to: "Don",
          status_text: "not done"
      })
      .end(function(err,res){
          issue1 = res.body;
          assert.equal(res.status,200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.issue_title,"issue 1");
          assert.equal(res.body.issue_text,"functional test");
          assert.equal(res.body.created_by,"FCC");
          assert.equal(res.body.assigned_to,"Don");
          assert.equal(res.body.status_text,"not done");
          done();
      });
    });
    test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/testing123')
        .send({
          issue_title: "issue 2",
          issue_text: "functional test",
          created_by: "Don"
        })
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.type,'application/json');
          assert.equal(res.body.issue_title,"issue 2");
          assert.equal(res.body.issue_text,"functional test");
          assert.equal(res.body.created_by,"Don");
          done();
        });
    });
    test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/testing123')
        .send({
          issue_title:'',
          issue_text:'',
          created_by:''
        })
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.type,'application/json');
          assert.equal(res.body.error,'required field(s) missing');
          done();
        });
    });
  });
  suite('3 GET request', function(){
    test('View issues on a project: GET request to /api/issues/{project}',function(done){
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/testing123')
        .end(function(err,res){
          assert.equal(res.status,200);
          done();
        })
    });
    test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done){
      chai  
        .request(server)
        .keepOpen()
        .get('/api/issues/testing123')
        .query({
          _id:issue1._id
        })
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.body[0].issue_title,issue1.issue_title);
          assert.equal(res.body[0].issue_text,issue1.issue_text);
          done();
        });
    });
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/testing123')
        .query({
          issue_title:issue1.issue_title,
          issue_text:issue1.issue_text
        })
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.body[0].issue_title,issue1.issue_title);
          assert.equal(res.body[0].issue_text,issue1.issue_text);
          done();
        });
    });
  });
  suite('5 PUT request', function(){
    test('Update one field on an issue: PUT request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/testing123')
        .send({
          _id:issue1._id,
          issue_text:"diferente"
        })
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.type,'application/json');
          assert.equal(res.body.result,'successfully updated');
          done();
        });
    });
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}',function(done){
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/testing123')
        .send({
          _id:issue1._id,
          issue_text:"diferenteText",
          issue_title:"diferenteTitle"
        })
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.body.result,'successfully updated');
          done();
        });
    });
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done){
      chai  
        .request(server)
        .keepOpen()
        .put('/api/issues/testing123')
        .send({
          issue_text:"differenteText"
        })
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.type,'application/json');
          assert.equal(res.body.error,'missing _id');
          done();
        });
    });
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/testing123')
        .send({
          _id:issue1._id
        })
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.type,'application/json')
          assert.equal(res.body.error, 'no update field(s) sent');
          done();
        });
    });
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done){
      chai 
        .request(server)
        .keepOpen()
        .put('/apo/issues/testing123')
        .send({
          _id:"5ca1abb6ce037511f0006anda",
          issue_title: "update",
          issue_text: "update"
        })
        .end(function(err,res){
          assert.equal(res.status,404);
          assert.equal(res.body.error,undefined);
          done();
        });
    });
  });
  suite('3 DELETE request', function(){
    test('Delete an issue: DELETE request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/testing123')
        .send({
          _id:issue1._id
        })
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.body.result, 'successfully deleted');
          done();
        });
    });
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done){
      chai  
        .request(server)
        .keepOpen()
        .delete('/api/issues/testing123')
        .send({
          _id:"5ca1abb6ce037511f0006anda"
        })
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.body.error,'could not delete');
          done();
        })
    })
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/testing123')
        .send({})
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.body.error,'missing _id');
          done();
        });
    });
  }); 
});

