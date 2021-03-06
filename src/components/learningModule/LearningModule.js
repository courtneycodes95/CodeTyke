import React from 'react';
import SelectionBox from '../selectionBox/SelectionBox';
import Button from '../button/Button';
import ProgressBar from '../progressBar/ProgressBar';
import Modal from '../modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import './Styles.scss';

const LearningModule = ({setGameStatus}) => {
  const [currentQuestionId, setCurrentQuestionId] = React.useState(0);
  const [quizData, setQuizData] = React.useState({});
  const [showLoader, setShowLoader] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [userResponse, setUserResponse] = React.useState([]);

  let currentQuestion = quizData.questionArr ? quizData.questionArr[currentQuestionId]: {};
  React.useEffect(()=>{
    getQuizData();
  },[]);

  const getQuizData=()=>{
    fetch("http://localhost:8080/problems")
      .then((res)=>{
        return res.json();
      }).then((data)=>{
        setQuizData(data);
      }).catch((err)=>{
        console.log(err);
      });
	}
	
	const checkAnswers = () => {
		let correctUserResponses = 0;
		let incorrectUserResponses = 0;
		for (const response of userResponse) {
			if (response.answer.isCorrect) correctUserResponses++
			else incorrectUserResponses++
		}

		if (correctUserResponses && !incorrectUserResponses) {
			if (correctUserResponses < correctSolutions) {
				console.log("Missing some correct answers");
			} else if (correctUserResponses === correctSolutions) {
				console.log("ALL responses are CORRECT :)");
			}
		} else if (correctUserResponses && incorrectUserResponses) {
			console.log("Some are correct and some are incorrect")
		} else {
			console.log("Did not select any correct answers")
		}
	}

  const handleSubmit=()=> {
    if (userResponse.length) {
      if(currentQuestionId < quizData.totalQuestions-1){
        setShowLoader(true);
        setTimeout(function(){
					console.log("Checking answer...");
					checkAnswers();
          setCurrentQuestionId(currentQuestionId+1);
					setShowLoader(false);
				}, 500 );
			} else {
				setCurrentQuestionId(0);
				setGameStatus({message: "Great Job! Play again.", loadIntro: true});
			}
		}
	}
	
  const handleUserChange = (selection, isSelected) => {
		if (isSelected) {
			setUserResponse([...userResponse, possibleAnswers[selection].props])
		} else {
			let updatedResponse = userResponse.filter((answer) => answer.id !== selection)
			setUserResponse(updatedResponse);
		}
	}
	
	let possibleAnswers = [];
	let correctSolutions = 0;
  if(currentQuestion.possibleAnswers){
    possibleAnswers = currentQuestion.possibleAnswers.map((answer, index) => {
      return <SelectionBox id={index} key={index} answer={answer} handleUserChange={handleUserChange} />
		})
		currentQuestion.possibleAnswers.forEach((option) => {
			if (option.isCorrect) correctSolutions++;
		})
  }

  const toggleAdditionalInfo = () => {
    setShowModal(!showModal);
  }

  return (
    <div className="learningModule">
      { currentQuestion.title &&
        <>
          <div className="learningModule--overlay"  onClick={toggleAdditionalInfo} style={{display: showModal ? "block" : "none"}}></div>
          <Modal showModal={showModal} setShowModal={setShowModal}>
            {currentQuestion.additionalInfo}
          </Modal>
          <ProgressBar totalQuestions={quizData.totalQuestions} id={currentQuestion.id} />
          <div className="learningModule--header">
            <div className="learningModule--title">
              { currentQuestion.title }
            </div>
            <div className="learningModule--additionalInfoIcon">
                <FontAwesomeIcon icon={faInfoCircle} onClick={toggleAdditionalInfo} size="lg" />
              </div>
            <div className="learningModule--subHeader">
              { currentQuestion.additionalInfo }
            </div>
          </div>

          <div className="learningModule--answerArea">
            <div className="learningModule--selections">
              { possibleAnswers }
            </div>
            <div className="learningModule--submitButtonContainer">
              <Button 
								label="Submit"
								handleSubmit={handleSubmit}
								showLoader={showLoader}
								hasIcons
								disabled={!userResponse.length}
								showArrow={!showLoader}
							/>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default LearningModule;
