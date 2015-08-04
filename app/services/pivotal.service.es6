'use strict';

app.factory('PivotalTracker', ['$http','$q',
  function($http,$q) {

      let addMandaysCategoryToStories = (stories) =>{
        return stories.map( (story) => {

            for( let label of story.labels) {
                if (label.name.includes('m:'))
                    story.mandays = parseFloat(label.name.substring(2));
                if (label.name.includes('c:'))
                    story.category = label.name.substring(2);
                if (label.name.includes('i:'))
                    story.nostro_id = label.name.substring(2);
            }
            return story;
        })
      }


      let getCurrentIteration = (projectID) => {
          let response = $q.defer();
          $http.get(`https://www.pivotaltracker.com/services/v5/projects/${projectID}/iterations`,
              {
                  headers: {
                      'X-TrackerToken': '222069cee93cc9a8651bb4bcccc2c5d7'
                  }
              })
              .success( (iterations) => {
                  let currentIteration = iterations[iterations.length-1];
                  currentIteration.stories = addMandaysCategoryToStories(currentIteration.stories);
                  response.resolve(currentIteration)})
              .error( (message) => { response.reject(message)})
          return response.promise;

      }




      return {
          name: 'pivotal-tracker',
          getEpics: (projectId) => {
            let response = $q.defer();
            $http.get(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/epics`)
                .success( (epics) => { response.resolve(epics)})
                .error( (message) => { response.reject(message)})
            return response.promise;
          },

          getAllStories : (projectID) => {
              let response = $q.defer();
              $http.get(`https://www.pivotaltracker.com/services/v5/projects/${projectID}/stories`,
              {
                      headers: {
                          'X-TrackerToken': '222069cee93cc9a8651bb4bcccc2c5d7'
                      }
                  })
                  .success( (stories) => { response.resolve(addMandaysCategoryToStories(stories))})
                  .error( (message) => { response.reject(message)})
              return response.promise;
          },

          getAllIterations : (projectID) => {
              let response = $q.defer();
              $http.get(`https://www.pivotaltracker.com/services/v5/projects/${projectID}/iterations`,
                  {
                      headers: {
                          'X-TrackerToken': '222069cee93cc9a8651bb4bcccc2c5d7'
                      }
                  })
                  .success( (iterations) => {
                      iterations = iterations.map(
                              x => { x.start = (new Date(x.start)).toDateString();
                              x.finish = (new Date(x.finish)).toDateString();
                              return x;});
                      response.resolve(iterations.filter(x => x.length>0))})
                  .error( (message) => { response.reject(message)})
              return response.promise;
          },
          getCurrentIteration : getCurrentIteration
          ,

          getStoryTasks: (projectID,storyID) => {
              let response = $q.defer();
              $http.get(`https://www.pivotaltracker.com/services/v5/projects/${projectID}/stories/${storyID}/tasks`,
                  {
                      headers: {
                          'X-TrackerToken': '222069cee93cc9a8651bb4bcccc2c5d7'
                      }
                  })
                  .success( (tasks) => {
                      response.resolve(tasks)})
                  .error( (message) => { response.reject(message)})
              return response.promise;
          },

          getCurrentIterationUserAssignedStories: (projectID,userID) => {
              let response = $q.defer();
              getCurrentIteration(projectID).then( (iteration) => {
                  response.resolve(iteration.stories.filter( x => (x.owner_ids.indexOf(userID) != -1)))
              })
              return response.promise;
          },

           getRemainingMandays : (demoDay,persons) => {

              // Orario corrente
              let now = new Date();

              // Giorni effettive dalla scadenza
              let effectiveDaysRemaining = (Math.floor((demoDay - now) / (1000*60*60*24))) +1;

              let mandaysRemaining = effectiveDaysRemaining;

              let saturdayOrSunday = ([0,6].indexOf(now.getDay())) != -1;

              if(effectiveDaysRemaining>3)
                  if(saturdayOrSunday)
                      mandaysRemaining = 3;
                  else
                      mandaysRemaining -= 2;

              if(now.getHours() > 14 && !saturdayOrSunday)
                  mandaysRemaining -= 0.5;

              return mandaysRemaining * persons;

          }





      }
  }
]);

