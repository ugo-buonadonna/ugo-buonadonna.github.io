
/* jshint -W098 */
app.controller('PivotalTrackerCtrl', ['$scope', '$http', 'PivotalTracker', function ($scope, $http, PivotalTracker) {

    $scope.sprint = [];
    for (let i of (new Array(20).keys()))
        $scope.sprint[i] = {};
    // DA INSERIRE PER OGNI NUOVA ITERAZIONE
    // -------------------------------------
    $scope.sprint[0].nextDemoDay = new Date('08/13/2015');
    $scope.sprint[0].teamMembers = 3;
    $scope.sprint[0].ugoMandays = 7;
    $scope.sprint[0].andreaMandays = 6.5;
    $scope.sprint[0].davideMandays = 7;
    $scope.sprint[0].availableTeamMandays = $scope.sprint[0].ugoMandays + $scope.sprint[0].andreaMandays + $scope.sprint[0].davideMandays;
    $scope.sprint[0].goal = 'Analyze market needs to find right target';

    // -------------------------------------
    $scope.sprint[1].nextDemoDay = new Date('08/27/2015');
    $scope.sprint[1].teamMembers = 3;
    $scope.sprint[1].ugoMandays = 7;
    $scope.sprint[1].andreaMandays = 6.5;
    $scope.sprint[1].davideMandays = 7;
    $scope.sprint[1].availableTeamMandays = $scope.sprint[1].ugoMandays + $scope.sprint[1].andreaMandays + $scope.sprint[1].davideMandays;
    $scope.sprint[1].goal = 'Release web application and Chrome plugin';


    // -------------------------------------
    $scope.sprint[2].nextDemoDay = new Date('09/10/2015');
    $scope.sprint[2].teamMembers = 3;
    $scope.sprint[2].ugoMandays = 3;
    $scope.sprint[2].andreaMandays = 3;
    $scope.sprint[2].davideMandays = 3;
    $scope.sprint[2].availableTeamMandays = $scope.sprint[2].ugoMandays + $scope.sprint[2].andreaMandays + $scope.sprint[2].davideMandays;
    $scope.sprint[2].goal = 'New York trip';



    // -------------------------------------
    $scope.sprint[3].nextDemoDay = new Date('09/24/2015');
    $scope.sprint[3].teamMembers = 3;
    $scope.sprint[3].ugoMandays = 6.5;
    $scope.sprint[3].andreaMandays = 7;
    $scope.sprint[3].davideMandays = 7;
    $scope.sprint[3].availableTeamMandays = $scope.sprint[3].ugoMandays + $scope.sprint[3].andreaMandays + $scope.sprint[3].davideMandays;
    $scope.sprint[3].goal = 'Reach two more early adopter sites';
    $scope.sprint[3].remainingMandays = PivotalTracker.getRemainingMandays($scope.sprint[3].nextDemoDay,$scope.sprint[3].teamMembers);

    
    console.log(`REMANING MD: ${$scope.sprint[3].remainingMandays}`);
    $scope.data = {};
    $scope.data.currentPage = 4;         //Inserire il numero di sprint corrente

    //console.log(`AOOO ${ $scope.sprint[$scope.currentPage-1].availableTeamMandays}`)

    // -------------------------------------

    $http.defaults.useXDomain = true;
    $scope.projectID = 1398148; //Passparyou project id hardcoded
    $scope.andreaID = 1748762;
    $scope.davideID = 1748768;
    $scope.ugoID = 1748750;
    $scope.mandays = {};


    // Codici delle storie correnti che il team sta svolgendo
    // TODO: automatizzare con pivotal vedendo quelle attive tra le storie
    // assegnate.

    $scope['package'] = {
        name: 'pivotal-tracker'
    };

    let setCurrentTeamStories = () => {
        $scope.currentDavide = "B06";
        $scope.currentMdDavide = "0.5";

        $scope.currentAndrea = "B07";
        $scope.currentMdAndrea = "3.5";

        $scope.currentUgo = "S16";
        $scope.currentMdUgo = "3";
    };


    let resetMdays = () => {
        $scope.currentDavide = "-";
        $scope.currentMdDavide = "-";

        $scope.currentAndrea = "-";
        $scope.currentMdAndrea = "-";

        $scope.currentUgo = "-";
        $scope.currentMdUgo = "-";
    };

    resetMdays();



    // Funzione per calcolare tutto ciò di cui si ha bisogno
    var calculateData = function (currentIteration) {
        console.log(`Sprint = ${$scope.data.currentPage}`);
        $scope.mandays = {};
        $scope.sprintVelocity = 0;
        $scope.currentIterationStories = currentIteration.stories;
        $scope.currentIteration = currentIteration;
        $scope.currentIterationStories.completed = [];
        $scope.currentIterationStories.notCompleted = [];
        for (let story of $scope.currentIterationStories) {

            // Calcolo i manday per ogni categoria ed i mandays totali
            $scope.mandays[story.category] = ($scope.mandays[story.category] || 0 ) + story.mandays;
            $scope.sprintVelocity = ($scope.sprintVelocity || 0) + story.mandays
            // Aggiungo le storie a seconda del loro stato
            switch (story.current_state) {
                case 'accepted':
                case 'delivered':
                case 'finished':
                    $scope.currentIterationStories.completed.push(story);
                    break;
                default:
                    $scope.currentIterationStories.notCompleted.push(story);
                    break;
            }
        }
    };


    // Get all project stories
    PivotalTracker.getAllStories($scope.projectID).then(function (stories) {
        $scope.allStories = stories;


    });

    // Get all project iterations
    PivotalTracker.getAllIterations($scope.projectID).then(function (iterations) {
        $scope.allIterations = iterations;
        $scope.totalItems = $scope.allIterations.length;
        //$scope.currentPage = $scope.totalItems;
        console.log($scope.allIterations);
        console.log("wewewewe" + $scope.totalItems + $scope.data.currentPage);
    });

    // Get nth sprint
    // and its stories
    // and calculates remaining mandays
    PivotalTracker.getNthIteration($scope.projectID,$scope.data.currentPage).then(function (currentIteration) {
        calculateData(currentIteration);
    })



    // Quando si cambia sprint, modifica storie, mandays, quanto manca al demo, dettagli sulla storia /tasks
    $scope.pageChanged =  () => {
        PivotalTracker.getNthIteration($scope.projectID,$scope.data.currentPage).then(function (currentIteration) {
        calculateData(currentIteration);
    });
        if($scope.data.currentPage == $scope.allIterations.length ) {
            //$scope.setRemainingMandays($scope.allIterations.length);
            setCurrentTeamStories();
        }

        else
            resetMdays();
        //$scope.setRemainingMandays($scope.data.currentPage);
        $scope.storyDemo = undefined;
        $scope.tasks = undefined;
    }

   /* PivotalTracker.getNthIterationUserAssignedStories($scope.projectID, $scope.ugoID,$scope.currentPage).then(function (stories) {
        $scope.storiesUgo = stories;

        $scope.storiesDavide = stories;
    })
    PivotalTracker.getNthIterationUserAssignedStories($scope.projectID, $scope.andreaID,$scope.currentPage).then(function (stories) {
        $scope.storiesUgo = stories;

        $scope.storiesDavide = stories;
    })
    PivotalTracker.getNthIterationUserAssignedStories($scope.projectID, $scope.davideID,$scope.currentPage).then(function (stories) {
        $scope.storiesUgo = stories;

        $scope.storiesDavide = stories;
    })*/


    //Per prendere i task di una storia, vedo l'attibuto 'data-story-id' del bottone premuto
    $scope.getStoryDemoAndTasks = function (storyId) {
        /*PivotalTracker.getStoryTasks($scope.projectID, element.target.getAttribute('data-story-id')).then(function (tasks) {
         $scope.tasks = tasks;
         });*/
        PivotalTracker.getStory($scope.projectID, storyId).then(function (story) {
            $scope.storyDemo = story.description;
        });
        PivotalTracker.getStoryTasks($scope.projectID, storyId).then(function (tasks) {
            $scope.tasks = tasks;
        });


    };

    $scope.getRemainingMandays = function (demoDay, teamMembers) {
        return PivotalTracker.getRemainingMandays(demoDay, teamMembers);
    };

    $scope.setRemainingMandays = (sprintNumber) => {
        $scope.sprint[sprintNumber-1].remainingMandays = $scope.getRemainingMandays($scope.sprint[sprintNumber-1].nextDemoDay,$scope.teamMembers);}
    //$scope.setRemainingMandays($scope.allIterations.length);

    $scope.getColorFromCategory = function (category) {
        if (category.indexOf('business') > -1) return 'background:#3B83BD';
        else if (category.indexOf('software') > -1) return 'background:#F3DA0B';
        else if (category.indexOf('design') > -1) return 'background:#23282B';
        else if (category.indexOf('marketing') > -1) return 'background:#CB2821';else return '';
    };
}]);
