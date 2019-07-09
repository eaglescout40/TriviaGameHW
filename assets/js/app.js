$(document).ready(function(){
  
  // Event listeners
  $("#remaining-time").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click' , '.option', trivia.guessChecker);
  
})

var trivia = {
  // Properties
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 20,
  timerOn: false,
  timerId : '',

  // Questions, Options and Answers data
  questions: {
    q1: 'Who is actually a chef?',
    q2: 'What does Joey love to eat?',
    q3: 'How many times has Ross been divorced?',
    q4: 'How many types of towels does Monica have?',
    q5: "Who's name is on the TV Guide?",
    q6: 'Who hates Thanksgiving?',
    q7: "Who thinks they're always the last to find out everything?",
    q8: "What is Chandlers job?"
  },
  options: {
    q1: ['Monica', 'Chandler', 'Rachel', 'Ross'],
    q2: ['Pizza', 'Fruit', 'Sandwiches', 'Pizza'],
    q3: ['5', '2', '1', '3'],
    q4: ['3', '8', '11', '6'],
    q5: ['Chandler Bing','Shanda Bing','Chanandler Bong','Chandler Bong'],
    q6: ['Joey','Chandler','Rachel','Ross'],
    q7: ['Ross', 'Phoebe', 'Monica','Chandler'],
    q8: ['Comic book writer', 'IT Procurements Manager', 'Transposter', 'Unemployed']
  },
  answers: {
    q1: 'Monica',
    q2: 'Sandwiches',
    q3: '3',
    q4: '11',
    q5: 'Chanandler Bong',
    q6: 'Chandler',
    q7: 'Phoebe',
    q8: 'IT Procurements Manager'
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