import React, {useEffect, useState} from 'react'
import PrevCard from './PrevCard'
import {Link} from "react-router-dom";
// import { useEffect } from 'react';
import { Loading } from '../LoadingComponent';
import { Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup,Label,Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';


//    const [surveys,setsurveys]=useState([]);

  

export default function Dashboard(props) {
    useEffect(() =>{
        setTimeout(() =>{
            localStorage.removeItem("deleteMessage")
        }, 1500)
    }, []);
    //  useEffect(()=>{

    //       // localStorage.removeItem('surveys');
    //         if(props.Surveys.surveys.length===0 && !props.Surveys.isLoading){
    //             props.fetchSurveys();
    //             console.log("Surveys of the user is ",props.Surveys.Surveys);

    //         }

    //  },[]);
     const [isModalOpen,setModelopen]=useState(false);
     const [deleteMessage, setDeleteMessage] = useState(localStorage.getItem("deleteMessage"));

    let surveys = [
        {
            type: "CreateNew",
            goto: "createNewSurvey"
        },
        ...props.Surveys.surveys
        
    ];
    let loading = null;
    if(props.Surveys.isLoading){
        loading = <div className="m-3">
            <b>Previous Surveys</b>
            <Loading/>
        </div>
    }
const [msg,setMsg]=useState(null);
    let prevs = surveys.map((survey, index) =>{
        return (
            <React.Fragment>
            <Col>
            <div className="m-3">
            <PrevCard setDeleteMessage={setDeleteMessage} setMsg={setMsg} type={survey.type?survey.type:"survey"} index={index-1} surveyTitle={survey.surveyTitle} description={survey.description} surveyId={survey._id}  survey={props.Surveys} fetchSurveys={props.fetchSurveys}/>
            </div>

        

                </Col>
                {/* {loading === null ? null : <Col> {loading}</Col>} */}
            </React.Fragment>
        )
    })
    let modelbody=null;

    if(props.auth.profileLoading){
        modelbody=<Label color="light"><Loading/></Label>
    }
    else if(props.auth.usercreds && !props.auth.profileLoading){
        modelbody=(  <ModalBody>
            <Form>

                <FormGroup>
                    <Label>First_name: </Label><Label><h6>{props.auth.usercreds.first_name}</h6></Label>
                  
                </FormGroup>
                <FormGroup>
                    <Label>Last_name: </Label><Label><h6>{props.auth.usercreds.last_name}</h6></Label>
                </FormGroup>
                <FormGroup>
                <Label>Email: </Label><Label><h6>{props.auth.usercreds.email}</h6></Label>
                </FormGroup>

            </Form>
        </ModalBody>);
    }
    // if(props.Surveys.errMess){
    //     return (
    //
    //         <Row>
    //
    //         <h4>Failed to fetch surveys!</h4>
    //
    //         </Row>
    //     );
    // }
    // if( props.Surveys.isLoading)
    // {
    //     return <Loading/>
    // }
    const toggleModal=()=>{
            setModelopen(!isModalOpen);     
      }
    return (
        <React.Fragment>
          
            <div className="d-flex justify-content-end mt-3 mr-4" ><Button className="btn-lg colorAndB2" type="button" onClick={toggleModal}>View your profile</Button></div>

        <div className="container">
        <div className="row">
                <div className="col-12">

                <Breadcrumb>
                    <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Dashboard</BreadcrumbItem>
                </Breadcrumb>
                </div>
            </div>
            <Row>
                <Col> {msg} <br/> {deleteMessage && (
                    <div className="alert alert-success mt-2" role="alert">
                    {deleteMessage}
                </div>
                )}</Col>
            </Row>
            <Row>
                <Col>
                <div className="mt-3 text-center colorAndB2" style={{ padding:'4px'}} >
                    <h2>Your surveys</h2>
                </div>
                </Col>
            </Row>
            
            <Row>
                {prevs}
                {loading}

            </Row>     
            <Modal isOpen={isModalOpen} toggle={toggleModal}>
         <ModalHeader toggle={toggleModal}>User profile</ModalHeader>
         {modelbody}
       
     </Modal>
        </div>
        </React.Fragment>
    )
}
