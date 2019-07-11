$(document).ready(function(){
  
  // Event listeners
  $("#remaining-time").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click' , '.option', trivia.guessChecker);
  
})

  // Properties
var trivia = {
  
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 20,
  timerOn: false,
  timerId : '',

  // Questions, Options and Answers data
  questions: {
    q1: 'Who speaks the first line in A New Hope?',
    q2: 'Which of these characters appears in every main film?',
    q3: 'Hans response to Leah telling him she loves him?',
    q4: 'How fast is Hans ship?',
    q5: 'What is the name of Boba Fetts ship?',
    q6: 'What docking bay is used in Mos Eisley?',
    q7: "Where does Yoda live?",
    q8: "What line is in every movie?"
  },

  options: {
    q1: ['C3PO', 'Rebel Guard', 'Darth Vader', 'Princess Leah'],
    q2: ['Han Solo', 'Luke Skywalker', 'R2-D2', 'Anakin Skywalker'],
    q3: ['I love you, too.', 'Ditto', 'Me, too.', 'I know.'],
    q4: ['.5 past light speed.', '12 Parsecs', 'Fast enough', 'Hyperspace fast'],
    q5: ['Tantiv V','Slave 1','Falcon','Starkiller'],
    q6: ['94','64','84','54'],
    q7: ['Yavin 4', 'Dantooine', 'Dagobah','Naboo'],
    q8: ['I love you', 'The Force is strrong with you ', 'Whadda ya think? A pricess and a guy like me?', 'Ive got a bad feeling about this.'], 
  },
  
  answers: {
    q1: 'C3PO',
    q2: 'R2-D2',
    q3: 'I know.',
    q4: '.5 past light speed.',
    q5: 'Slave 1',
    q6: '94',
    q7: 'Dagobah',
    q8: 'Ive got a bad feeling about this.'
  },
  
  // Initialize game
  startGame: function(){
    // restarting game results
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);
    
    // Show game 
    $('#game').show();
    
    //  Empty last results
    $('#results').html('');
    
    // Show timer
    $('#timer').text(trivia.timer);
    
    // Remove start button
    $('#start').hide();

    $('#remaining-time').show();
    
    // Ask question
    trivia.nextQuestion();
    
  },

  // Loop through and display questions 
  nextQuestion : function(){
    
    // Set timer to 10 seconds each question
    trivia.timer = 10;
     $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);
    
    // Prevent timer speed up
    if(!trivia.timerOn){
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }
    
    // Gets the questions and indexes current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);
    
    // Array of user options for current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];
    
    // Creates guess options in the html
    $.each(questionOptions, function(index, key){
      $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
    })
    
  },
  // Decrement counter and count unanswered
  timerRunning : function(){

    // If timer has time left over and questions left to ask
    if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
      $('#timer').text(trivia.timer);
      trivia.timer--;
        if(trivia.timer === 4){
          $('#timer').addClass('last-seconds');
        }
    }

    // Time has run out and increment unanswered, run result
    else if(trivia.timer === -1){
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Sorry! You are out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
    }
    // All questions have been shown, end the game, show results
    else if(trivia.currentSet === Object.keys(trivia.questions).length){
      
      // Adds results of game (correct, incorrect, unanswered) to the page
      $('#results')
        .html('<h3>Thank you for playing! Come again soon!</h3>'+
        '<p>Correct: '+ trivia.correct +'</p>'+
        '<p>Incorrect: '+ trivia.incorrect +'</p>'+
        '<p>Unaswered: '+ trivia.unanswered +'</p>'+
        '<p>Play again?</p>');
      
      // Hide game section
      $('#game').hide();
      
      // Display start button to begin a new game
      $('#start').show();
    }
    
  },
  // Evaluate the option clicked
  guessChecker : function() {
    
    // Timer ID for gameResult setTimeout
    var resultId;
    
    // Answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
    
    // If the option picked matches the answer of the current question, increment correct
    if($(this).text() === currentAnswer){
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');
      
      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Correct Answer!</h3>');
    }
    // Else user picked the wrong option, increment incorrect
    else{
      // Turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');
      
      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Better luck next time! '+ currentAnswer +'</h3>');
    }
    
  },
  // Remove previous question results and options
  guessResult : function(){
    
    // Increment to next question
    trivia.currentSet++;
    
    // Remove options and results
    $('.option').remove();
    $('#results h3').remove();
    
    // Next question
    trivia.nextQuestion();
     
  }

}