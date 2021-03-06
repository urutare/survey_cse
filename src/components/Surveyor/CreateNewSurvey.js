import {Breadcrumb, BreadcrumbItem, Button} from "reactstrap";
import React, { useState } from "react";
import { Row, Input, Form, Label } from "reactstrap";
import AnswersComponet from "./AnswersComponet";
import CategoriesComponent from "./CategoriesComponent";
import QuestionsComponet from "./QuestionsComponet";
import {Link} from "react-router-dom";
import { Loading } from "../LoadingComponent";
import {findAllByPlaceholderText} from "@testing-library/react";
export default function CreateNewSurvey(props) {
    let testInfo = localStorage.getItem('surveyInfo') === null ?{
            surveyTitle:"Testing Survey title",
            surveys:{
                Default:{
                    questions:{}
                }

            }} : JSON.parse(localStorage.getItem('surveyInfo'));
    function addNewCategory(newCategory){
        let currentSurveyInfo = {...surveyInfo};
        currentSurveyInfo["surveys"][newCategory] ={};
        setsurveyInfo(currentSurveyInfo);
        localStorage.setItem('surveyInfo',JSON.stringify(currentSurveyInfo));
    };
    function editQuestion (oldQuestion, newQuestion) {
        let currentSurveyInfo = {...surveyInfo};
        currentSurveyInfo["surveys"][selectedCategory]["questions"][newQuestion] = currentSurveyInfo["surveys"][selectedCategory]["questions"][oldQuestion];
        delete currentSurveyInfo["surveys"][selectedCategory]["questions"][oldQuestion];
        setsurveyInfo(currentSurveyInfo);
        localStorage.setItem('surveyInfo',JSON.stringify(currentSurveyInfo));
        setSelectedQuestion(newQuestion);

    }
    function editAnswer (oldAnswer, newAnswer) {
        let currentSurveyInfo = {...surveyInfo};
        currentSurveyInfo["surveys"][selectedCategory]["questions"][selectedQuestion]["answers"][newAnswer] = currentSurveyInfo["surveys"][selectedCategory]["questions"][selectedQuestion]["answers"][oldAnswer];
        delete currentSurveyInfo["surveys"][selectedCategory]["questions"][selectedQuestion]["answers"][oldAnswer];
        setsurveyInfo(currentSurveyInfo);
        localStorage.setItem('surveyInfo',JSON.stringify(currentSurveyInfo));
    }
    function editCategory (oldCategory, newCategory) {
        let currentSurveyInfo = {...surveyInfo};
        currentSurveyInfo["surveys"][newCategory] = currentSurveyInfo["surveys"][oldCategory];
        delete currentSurveyInfo["surveys"][oldCategory];
        setsurveyInfo(currentSurveyInfo);
        localStorage.setItem('surveyInfo',JSON.stringify(currentSurveyInfo));
        setSelectedCategory(newCategory);
    }
    function addNewQuestion(newQuestion){
        let currentSurveyInfo = {...surveyInfo};
        if(selectedCategory !== null){
            if(currentSurveyInfo["surveys"][selectedCategory]["questions"] === null || currentSurveyInfo["surveys"][selectedCategory]["questions"] === undefined){
                currentSurveyInfo["surveys"][selectedCategory]["questions"] = {};
            }
            
            currentSurveyInfo["surveys"][selectedCategory]["questions"][newQuestion] ={};
            setsurveyInfo(currentSurveyInfo);
            localStorage.setItem('surveyInfo',JSON.stringify(currentSurveyInfo));
        }
        else{
            currentSurveyInfo["surveys"]["Default"]["questions"][newQuestion] ={};
            setsurveyInfo(currentSurveyInfo);
            localStorage.setItem('surveyInfo',JSON.stringify(currentSurveyInfo));
        }
    }
    function addNewAnswer(newAnswer){
        if(selectedQuestion !==null){
            let currentSurveyInfo = {...surveyInfo};
            if(currentSurveyInfo["surveys"][selectedCategory]["questions"][selectedQuestion]["answers"]===null || currentSurveyInfo["surveys"][selectedCategory]["questions"][selectedQuestion]["answers"]=== undefined){
                currentSurveyInfo["surveys"][selectedCategory]["questions"][selectedQuestion]["answers"]={};
            }
            currentSurveyInfo["surveys"][selectedCategory]["questions"][selectedQuestion]["answers"][newAnswer]={};
            setsurveyInfo(currentSurveyInfo);
            localStorage.setItem('surveyInfo',JSON.stringify(currentSurveyInfo));
        }
    }
    function setWayOfAnsweringOnSelectedQuestion(selected){
        setWayOfAnswering(selected);
        let currentSurveyInfo = {...surveyInfo};
        currentSurveyInfo["surveys"][selectedCategory]["questions"][selectedQuestion]["wayOfAnswering"] = selected;
        setsurveyInfo(currentSurveyInfo);
        localStorage.setItem('surveyInfo',JSON.stringify(currentSurveyInfo));

        
    }
    function handleFinish(event) {
        if(surveyTitle === null){
            alert("fill title first")
            return
        }
        let currentSurveyInfo = surveyInfo;
        let readyData = {surveyTitle};
        let categoriesA = Object.keys(currentSurveyInfo["surveys"]);
        readyData["categories"] = [];
        categoriesA.forEach(category =>{
            let categ = {
                categoryName:category,
                questions:[]
            };
            let questions =!currentSurveyInfo["surveys"][category]["questions"] ?[] : Object.keys(currentSurveyInfo["surveys"][category]["questions"]);
            questions.forEach(question =>{
                
                let answers =!currentSurveyInfo["surveys"][category]["questions"][question]["answers"]?[] : Object.keys(currentSurveyInfo["surveys"][category]["questions"][question]["answers"]);
                let quest = {
                    question:question,
                    wayOfAnswering:currentSurveyInfo["surveys"][category]["questions"][question]["wayOfAnswering"],
                    answers:[...answers]
                }
                categ.questions.push(quest);
            })
            readyData.categories.push(categ);
        })

props.createNewSurvey(readyData);
        localStorage.removeItem('surveyInfo');
    }
    function ChangeSurveyTitle(event){
        //currentSurveyInfo.surveyTitle = event.value;
        setsurveyTitle(event.target.value)
    }
    const [surveyInfo, setsurveyInfo] = useState(testInfo);
    const [selectedCategory, setSelectedCategory] = useState("Default");
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [surveyTitle, setsurveyTitle] = useState(null);
     const [wayOfAnswering, setWayOfAnswering] = useState('Choose');
    let [showDelete,setShowDelete] = useState('null,null');
    
  let Finish = null;
  if(props.Surveys.submitisLoading){
      Finish=(<Button><Loading/></Button>);
  }
  else Finish=
  (<Button onClick={handleFinish}>
                Finish
            </Button> )
    let handleEnterAndLeave = (event) =>{
        let [category] = (event.target.id).split(',');

        let type = event.type;
        if(type === 'mouseenter'){
            if(category!==null || undefined)
            setShowDelete(category+',showIt');
        }
        else if(type === 'mouseleave'){
            setShowDelete(category+',hideIt');
        }
    }
    
    let questionArray = true;
    if(selectedCategory===null ||surveyInfo["surveys"][selectedCategory] ===undefined || surveyInfo["surveys"][selectedCategory]["questions"] ===undefined){
        questionArray = false;
    }
    let answerArray = true;
    if(selectedQuestion===null || surveyInfo["surveys"][selectedCategory] === undefined || surveyInfo["surveys"][selectedCategory]["questions"]===undefined ||
    surveyInfo["surveys"][selectedCategory]["questions"][selectedQuestion] === undefined || surveyInfo["surveys"][selectedCategory]["questions"][selectedQuestion]["answers"] === undefined ||surveyInfo["surveys"][selectedCategory]["questions"][selectedQuestion]["answers"] ===  null ){
        answerArray = false;
    }
    let enableChooseWayOfAnswering = false;
    if(selectedQuestion !==null){
        let currentSurveyInfo = {...surveyInfo};
        if(currentSurveyInfo["surveys"][selectedCategory]===undefined || currentSurveyInfo["surveys"][selectedCategory]["questions"] === undefined || currentSurveyInfo["surveys"][selectedCategory]["questions"][selectedQuestion]===null ||currentSurveyInfo["surveys"][selectedCategory]["questions"][selectedQuestion]=== undefined){
            enableChooseWayOfAnswering = false;
        }
        else{
            enableChooseWayOfAnswering = true;
        }
    }

  return (
    <div>
      <div className="">
          <div className="container">
             
              <div className="row">
                  <div className="col-12 ">
                      <Breadcrumb>
                          <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                          <BreadcrumbItem><Link to="/dashboard" onClick={props.fetchSurveys}>Dashboard</Link></BreadcrumbItem>
                          <BreadcrumbItem active>Create new survey</BreadcrumbItem>
                      </Breadcrumb>
                  </div>
              </div>
      <div className="row">
            <div className="col-12 mt-3 mb-3 colorAndB2 text-center">
                <h2>Creation of new survey</h2>
                <p>Use following cards to create your survey.</p>
                <p>Affter selecting category, questions in that category will shown on questions card. <br/> Same to answers that will shown after selection of question </p>
            </div>
        </div>
          </div>
        <div className="surveyContainer  container-survey">
            <div className="row row-content ">
                <div className="col-12 col-md-9">
                    <Form>
                        <Row>
                            <div className="col-11 ml-2">
                                <Label>Survey title</Label>
                                <Input onChange={ChangeSurveyTitle} type="text" />
                            </div>
                        </Row>
                    </Form>
                </div>
            </div>
            <div className="scrollable-x">
            <div className="scrollpart">
        
        <div className="row">
          <div className="col-4">
              <h6 className="m-1">Categories</h6>
            <CategoriesComponent editCategory={editCategory} categories={Object.keys(surveyInfo["surveys"])}
                                 selectedCategory={selectedCategory} handleEnterAndLeave={handleEnterAndLeave} showDelete={showDelete}
                                 setSelectedCategory={setSelectedCategory} addNewCategory={addNewCategory} />
          </div>
          <div className="col-4">
              <h6 className="m-1"> Questions in selected category</h6>
              <QuestionsComponet selectedQuestion={selectedQuestion} editQuestion={editQuestion}  handleEnterAndLeave={handleEnterAndLeave} showDelete={showDelete}
                                 questions={questionArray ?Object.keys(surveyInfo["surveys"][selectedCategory]["questions"]):[]}
              setSelectedQuestion={setSelectedQuestion}  addNewQuestion={addNewQuestion}/>
          </div>
          <div className="col-4">
              <h6 className="m-1"> Answer of selected question</h6>
            <AnswersComponet editAnswer={editAnswer} answers={answerArray?Object.keys(surveyInfo["surveys"][selectedCategory]["questions"][selectedQuestion]["answers"] ):[]}
                             addNewAnswer={addNewAnswer} handleEnterAndLeave={handleEnterAndLeave} showDelete={showDelete}
            setWayOfAnsweringOnSelectedQuestion={setWayOfAnsweringOnSelectedQuestion} wayOfAnswering={wayOfAnswering} selectedQuestion={selectedQuestion} enableChooseWayOfAnswering = {enableChooseWayOfAnswering}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end mt-3">
            {Finish}
        </div>
                {props.Surveys.message && (
                    <div className="alert alert-success mt-2" role="alert">
                        {props.Surveys.message}, <b>go to dashboard to view more!</b>
                    </div>
                )}
      </div>
    </div></div>
    </div></div>
  );
}
