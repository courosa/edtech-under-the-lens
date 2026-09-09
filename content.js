/* Additional fictional briefs. */
activities[0].briefs.push(
["AutoGroup","A tool that permanently groups students by their first quiz result."],
["TranslateAll","A translation system marketed as making language learning and human interpretation unnecessary."],
["ReadRace","An app that rewards pages turned without checking what readers understand."],
["QuietClass","A classroom system that treats silence as proof of successful teaching."],
["PerfectPresence","An attendance tool that equates being logged in with participating."],
["GradeGlow","A feedback platform that provides only a score and a cheerful animation."],
["ParentPulse","A service that sends families an alert for every classroom mistake."],
["LessonLock","A curriculum platform that prevents teachers from adapting its lesson sequence."]
);
activities[1].briefs.push(
["The eraser","A tool for removing marks and making room for revision."],
["The ruler","A straight edge with a scale for comparing lengths."],
["The globe","A small, curved model for exploring the Earth."],
["The magnifying glass","A lens for taking a closer look at small details."],
["The dictionary","An organized collection of words and their meanings."],
["The timer","A tool that makes the passing of a chosen interval noticeable."],
["The filing cabinet","A physical system for categorizing and retrieving records."],
["The map","A selective representation of places and their relationships."],
["The building block","A small object that can be joined with others to create structures."],
["The question box","A container for submitting questions without speaking to the whole room."]
);
activities[2].briefs.push(
["The Instant Expert Badge","A credential awarded immediately after watching a short video."],
["The Discussion Autopilot","A tool that posts a reply on every learner’s behalf."],
["The Perfect Partner Bot","A collaborator programmed never to disagree."],
["The Curiosity Scheduler","A system that assigns a fixed time and approved topic for every question."],
["The Universal Accent Filter","A system that changes every speaker’s voice to fit one pronunciation standard."],
["The Friendship Algorithm","A tool that assigns social groups to maximize predicted productivity."],
["The Efficiency Desk","A workstation that eliminates unplanned conversation and exploration."],
["The Mistake Eraser","A service that removes all traces of revision from student work."],
["The Field Trip Simulator","A service marketed as making visits to communities and places unnecessary."],
["The One-Click Reflection","A tool that writes a learner’s reflection before they have considered the experience."]
);
const talkInstructions=[
"Present your apology in 45–60 seconds: the promise, the harm, and the repair. Then explain one assumption about learning that your company got wrong.",
"Present your advertisement in 45–60 seconds: the name, the promise, the learning activity, and the fine print. Then identify one claim you would refuse to make honestly.",
"Present your museum label in 45–60 seconds: the invention, its turning point, and what was worth saving. Then explain which concern is plausible and what remains speculation."
];
const questions=[
[
["What was the most revealing assumption?","Name a specific line from an apology. What did the product treat as evidence of learning?","Notice"],
["Who had to adapt to whom?","Did the proposed repair change the technology, the teaching, or the learner? Whose voice should shape that decision?","Question"],
["Would you adopt the revised product?","Give one condition for saying yes and one piece of evidence that might change your mind.","Decide"],
["What question will you carry into next week?","Connect a fictional product to a real educational promise. What would you need to investigate?","Connect"]
],
[
["What won us over?","Which part of a pitch was persuasive? Was it also a strong educational reason?","Notice"],
["Could the same promise sell an AI tutor?","Which claims travelled easily between old and new tools? What does that suggest about the history of edtech?","Question"],
["What makes this educational technology?","Does educational value belong to the object, the activity, or the relationships around it? Defend your answer with an example.","Decide"],
["What evidence would distinguish learning from novelty?","Suggest one thing learners could do independently after using the tool.","Connect"]
],
[
["Where did satire become a credible warning?","Point to a specific design choice. What evidence would support or challenge the concern?","Notice"],
["Why might reasonable people have adopted it?","Consider workload, access, resources, and institutional pressures. Avoid treating adopters as foolish.","Question"],
["What deserved to survive?","How could you retain a useful goal while changing who has control or how success is judged?","Decide"],
["What would you put in a museum from today?","Offer a tentative example and a counterargument. What makes its future uncertain?","Connect"]
]
];

const legacyBriefs = activities.map(a => a.briefs.map(b => [...b]));

activities[0].briefs = activities[0].briefs.filter(b => !['Classroom Leaderboard','TextbookZero','AutoGroup','TranslateAll','PerfectPresence','GradeGlow','LessonLock'].includes(b[0])).map(b => b[0] === 'ParentPulse' ? ['Mistake Alerts','A school app that notifies families every time a learner makes a mistake.'] : b);
activities[1].briefs = activities[1].briefs.filter(b => !['The mirror','The filing cabinet','The map','The building block','The question box'].includes(b[0]));
activities[1].briefs.push(
 ['The interactive whiteboard','A shared digital surface for displaying, annotating, and moving ideas.'],
 ['The Gestetner duplicator','A stencil-based machine for making many paper copies of a teacher’s original.'],
 ['The photocopier','A machine that reproduces pages for sharing, practice, and annotation.'],
 ['The worksheet','A page of prompts or tasks that gives learners a structure to work within.'],
 ['The document camera','A camera that displays a page, object, or live demonstration to the whole class.']
);
activities[0].briefs.push(
 ['StreakSchool','A practice app that resets a learner’s progress streak whenever they miss a day.'],
 ['AutoGrade AI','An automated marker that assigns a final grade without explaining its reasoning or offering an appeal.'],
 ['NoMistakes Mode','A classroom platform that hides incorrect attempts and shows only polished final answers.'],
 ['OneSize Quiz','An assessment tool that gives everyone the same timed quiz with no alternative way to demonstrate understanding.'],
 ['TeachToTheTest','A planning tool that recommends only activities predicted to raise standardized test scores.'],
 ['ReplyForMe','An assistant that automatically writes and posts discussion replies on a learner’s behalf.'],
 ['DigitalOnly Classroom','A course platform that moves every activity online and offers no offline route.']
);
