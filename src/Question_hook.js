import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_ROOT = 'http://localhost:4000/api'
const instance = axios.create({
  baseURL: API_ROOT
})

function Question() {
  const [complete, setComplete] = useState(false)  // true if answered all questions
  const [contents, setContents] = useState([])     // to store questions
  const [ans, setAns] = useState([])               // to record your answers
  const [score, setScore] = useState(0)            // Your score
  const [current_question, setCurrentQuestion] = useState(0) // index to current question

  const next = async () => {
    // TODO : switch to the next question,
    // and check answers to set the score after you finished the last question
    if(current_question < contents.length) {
      setCurrentQuestion(current_question+1)
    }
    else {
      const {
        data: { message , score }
      } = await instance.post('/checkAns', { ans: { ans } })
      setScore( score );
      setComplete( true );
    }
  }

  const choose = (event) => {
    // TODO : update 'ans' for the option you clicked
    ans[current_question-1] = parseInt(event.target.value)
    setAns( ans )
  }

  const getQuestions = async () => {
    // TODO : get questions from backend
    const {
      data: { message , contents }
    } = await instance.get('/getContents')
    setCurrentQuestion(1)
    setContents(contents)
  }

  const checkChild = (event) => {
    if(event.target.children.length>0){
        event.target.firstChild.checked = true;
        ans[current_question-1] = parseInt(event.target.firstChild.value)
        setAns( ans )
      }
      else if (event.target.tagName == "SPAN") {
        event.target.previousSibling.checked = true;
        ans[current_question-1] = parseInt(event.target.previousSibling.value)
        setAns( ans )
      }
  }

  useEffect(() => {
    if (!contents.length)
      getQuestions()
  })

  // TODO : fill in the rendering contents and logic
  return (
    <div id="quiz-container">
      { complete ? <React.Fragment>
                <div id="question-box">
                  <div className="question-box-inner">
                    Question {current_question} of {contents.length}
                  </div>
                </div>
      
                <div id="question-title">
                  Your Score : {score} / {contents.length}
                </div>
      
                <div>
                </div>
                
                <div>
                </div>
              </React.Fragment> : (contents.length?
              <React.Fragment>
                <div id="question-box">
                  <div className="question-box-inner">
                    Question {current_question} of {contents.length}
                  </div>
                </div>
      
                <div id="question-title">
                  {contents[current_question-1].question}
                </div>
      
                <div id="options">
                  {contents[current_question-1].options.length === 0 ? (
                    <div className="each-option">
                    </div>
                  ) : (
                    contents[current_question-1].options.map((op, index) => (
                      <div className="each-option" onClick={checkChild}>
                        <input
                          type="radio"
                          id={"q"+current_question+"_"+(index+1)}
                          key={"q"+current_question+"_"+(index+1)}
                          value={(index+1)}
                          name="button"
                          onChange={choose}
                        />
                        <span>{op}</span>
                      </div>
                    ))
                  )}
                </div>
                
                <div id="actions" onClick={next}>
                  NEXT
                </div>
              </React.Fragment>
              : <React.Fragment></React.Fragment>)
      }
    </div>
  )
}

export default Question
