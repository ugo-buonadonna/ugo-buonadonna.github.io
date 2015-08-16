'use strict';

app.factory('PivotalTracker', ['$http','$q',
  function($http,$q) {

      let addMandaysCategoryToStories = (stories) =>{
        return stories.map( (story) => {

           /* for( let label of story.labels) {
                if (label.name.indexOf('m:') > -1)
                    story.mandays = parseFloat(label.name.substring(2));
                if (label.name.includes('c:'))
                    story.category = label.name.substring(2);
                if (label.name.includes('i:'))
                    story.nostro_id = label.name.substring(2);
            }
            return story;
        })*/
            for( let label of story.labels) {
                if (label.name.indexOf('m:') > -1)
                    story.mandays = parseFloat(label.name.substring(2));
                if (label.name.indexOf('c:') > -1)
                    story.category = label.name.substring(2);
                if (label.name.indexOf('i:') > -1)
                    story.nostro_id = label.name.substring(2);
            }
            return story;
        })
      }


      let getNthIteration = (projectID,n) => {
          let response = $q.defer();
          $http.get(`https://www.pivotaltracker.com/services/v5/projects/${projectID}/iterations`,
              {
                  headers: {
                      'X-TrackerToken': '222069cee93cc9a8651bb4bcccc2c5d7'
                  }
              })
              .success( (iterations) => {
                  let currentIteration = iterations[n-1];
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
                      response.resolve(iterations/*.filter(x => x.length>0)*/)})
                  .error( (message) => { response.reject(message)})
              return response.promise;
          },
          getNthIteration : getNthIteration
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
          getStory: (projectID,storyID) => {
              let response = $q.defer();
              $http.get(`https://www.pivotaltracker.com/services/v5/projects/${projectID}/stories/${storyID}`,
                  {
                      headers: {
                          'X-TrackerToken': '222069cee93cc9a8651bb4bcccc2c5d7'
                      }
                  })
                  .success( (story) => {
                      response.resolve(story)})
                  .error( (message) => { response.reject(message)})
              return response.promise;
          },

          getNthIterationUserAssignedStories: (projectID,userID,n) => {
              let response = $q.defer();
              getNthIteration(projectID,n).then( (iteration) => {
                  response.resolve(iteration.stories.filter( x => (x.owner_ids.indexOf(userID) != -1)))
              })
              return response.promise;
          },

           getRemainingMandays : (demoDay,persons) => {
               console.log(`demo Day = ${demoDay}`);
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

               if(mandaysRemaining < 0)
                  mandaysRemaining = 0;

              return mandaysRemaining * persons;

          }





      }
  }
]);

