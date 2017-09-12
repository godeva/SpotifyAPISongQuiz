# cs4241-FinalProject

For your final project, you'll implement a course project that exhibits your mastery of the course materials. 
This project gives you an opportunity to be creative and to pursue individual research and learning.

## General description

Your project should consist of a complete Web application. 
The site must exhibit facets of the three main sections of the course material:

- Static Web page content and design. You should have a project that is well-designed, easily navigable, and exhibits good human-computer interaction.
- Dynamic behavior implemented with JavaScript and possibly other JavaScript librarires.
- Server-side programming. Typically this will take the form of some sort of persistent data and possibly server-side computation.

Additionally, you should incorporate features that you independently research, design, and implement for your project.

## Example Projects

The following list describes a few examples of what I would consider to be good projects. 
Excellent projects serve someone/some group: define your users and stakeholders. 
Don't just create a webapp with a pile of features.
I encourage you to identify projects that will have impact.

Here are some ideas:

- Interactive data visualization: Find an interesting dataset, then visualize it using d3.js. See visualizations on the New York Times, 538, or [mbtaviz (wpi grads!)](https://mbtaviz.github.io/) for inspiration.
    - Server-side components for data visualization could include state-tracking, computation (e.g. machine learning), and many other data-related possibilities.
- WPI Infrastructure: There are a lot of things that could be done better on the WPI school website. Find something you care about and make a prototype that shows how it could be better. Avoid course schedulers or course survey browsers, as these already exist.
- (bonus) Infrastructure ideas: Course sizes are growing, making it more difficult than ever for professors to learn about all the students in their course. Create a webapp that provides a better interface to the students in the course (search, filtering, with profiles almost like Facebook) using Banner data. Alternately, create a flash-card game that uses student data (pictures, names) to help professors get to know their students.

The above are just a few possibilities.
Create something useful for a cause or hobby you care about; something that will help you grow as a student.

Also see our [hall of fame](https://cs4241-17a.github.io/fame/), with notable projects from prior offerings of the course.

## Logistics

### Team size
Students are encouraged to work in teams of 4-5 students for the project. 
This will allow you to build a good project without expending an excessive amount of effort. 
While I would expect a team of four students to produce a project with more features, I expect a single person project to exhibit all of the required facets described above.

### Deliverables

__Proposal:__ 
Provide an outline of your project and the names of the team members. 
The outline should have enough detail so that I can determine if it meets the minimum expectations, or if it goes too far to be reasonable by the deadline.
This file must be named proposal.md so we can find it.
Submit a PR to turn it in.

__Evaluation:__ 
Conduct an evaluation of your website, with 5 people.
Sessions should be a minimum of 10 minutes per person.
Evaluations should be semi-structured: users must perform tasks on their own without your help (i.e., observe only!).
Allow participants to "think-aloud" to gain insights into what's going on in their mind as they use your site.
After you've ran participants, analyze and report on your results in evaluation.md.
A good evaluation will uncover both usability challenges as well as design challenges.
Submit along with your final code to turn it in.

There are no other scheduled checkpoints for your project. 
You must be done in time to present before the final project demo day. 

#### Turning in Your Outline / Project

Submit a second PR on the final project repo to turn in your outline and code.

Deploy your outline, in the form of a webpage, to Heroku or some other service.
Ensure that your project has the proper naming scheme (fp-yourGitHubUsername) so we can find it.
Folks on the same team do not need to post the same webpage, but must instead clearly state who is on the team in their proposal.
(Staff will use the proposal to build the grading sheet.)

## Final Presentation

Presentations will occur during the final week of class.

As for the presentations, we will take over a different room on WPI's campus, with tables.
You'll set up and demo to folks who stop by.
You'll demo to staff as part of your grade.

Naming and URL Scheme
---

You must use a consistent naming scheme for all projects in this course.
If we can't find it, we can't grade it.

By default Heroku assigns your application a random name.
To change it, follow [this guide](https://devcenter.heroku.com/articles/renaming-apps).

Only one team member needs to deploy the project on heroku.

The name scheme should be `fp-yourGitHubUsername`. 

## FAQs

- **Can I open-source my project?** You may open source your project after the class ends. 
I encourage it. While other course code should be kept hidden, this is a case where others can and should learn and draw inspiration from everyone else.

- **Can I use XYZ framework?** You can use any web-based frameworks or tools available.
