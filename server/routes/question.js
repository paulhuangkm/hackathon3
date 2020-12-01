import Question from '../models/Question'
import Answer from '../models/Answer'

exports.GetContents = async (req, res) => {
  // TODO : get questions from mongodb and return to frontend
  await Question.find()
  .limit(10000)
  .sort({ _id: 1 })
  .exec((err, data) => {
    if (err) {
    	res.status(500).send({ message: 'error', contents: [] })
    }
    else{
        // initialize app with existing messages
    	res.status(200).send({ message: 'success', contents: data })
    }
  })
}

exports.CheckAns = async (req, res) => {
  // TODO : get answers from mongodb,
  // check answers coming from frontend and return score to frontend
  let score = 0, index = 1, {ans}=req.body.ans;
  await Answer.find()
  .limit(10000)
  .sort({ _id: 1 })
  .exec((err, data) => {
    if (err) {
    	console.log(err);
    	res.status(403).send({ message: 'error', score: -1 })
    }
    else{
        // initialize app with existing messages
        for( index = 1 ; index <= ans.length ; index++){
                	if(data[index-1].answer === ans[index-1])
                		score++;
                }
    	res.status(200).send({ message: 'success', score: score })
    }
  })
}
