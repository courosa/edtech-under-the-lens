# EdTech Under the Lens

Writing, brainstorming, and discussion activities for thinking critically about educational technology. Created by Dr. Alec Couros.

## The activities

- **The Corporate Apology Tour:** write an apology from a fictional edtech company and examine the consequences of its promises.
- **Pitch the Product:** sell a familiar classroom tool, then explain the learning behind the pitch.
- **The Future Museum:** imagine a technology's rise and fall, and consider what was worth keeping.

Each activity offers 20 briefs. Participants can edit a brief, write independently or together, present their piece, and discuss one question at a time. The site does not use AI to generate or assess responses.

Originally created for **EC&I 833: Foundations of Educational Technology**, a graduate course at the University of Regina.

## Use or adapt it

Open `index.html` in a browser, or serve the folder with a static web server. There is no installation or build step.

To build your own version, fork this repository or choose **Code → Download ZIP**, edit the files, and upload them to your own static hosting. Keep all files together, and preserve the licence and attribution.

The publication destinations for this project are:

- https://eci833.ca/icebreakers/
- https://couros.ca/icebreakers/

The two destinations use identical files. Browser drafts are separate because each domain has its own browser storage.

## Editing the project

| File | Purpose |
|---|---|
| `index.html` | Activity interface, instructions, and footer |
| `about.html` | Purpose, course origins, and adaptation information |
| `app.js` | Prompts and finished-piece templates |
| `content.js` | Brief menus and previous menu definitions for migration |
| `experience.js` | Navigation, saving, resets, editing, presentation, and discussion |
| `style.css` | Desktop and mobile styling |

Use the Oxford comma, and avoid em dashes in user-facing copy.

## Saved work and resets

Drafts stay in the participant's browser and are not uploaded, synced, or assessed. Download text to keep or share a copy. Storage availability can vary when opening a local file; the app reports saving failures.

Opening an activity starts at step 1 and retains answers. Back to beginning keeps work. Reset this activity clears only that activity. Clear all saved work removes this app's current and older saved drafts, without clearing unrelated browser data. Reset controls ask for confirmation.

The new storage key is `edtech-under-the-lens-v2`. Older `edtech-thought-lab-v1` drafts are imported when no new-format save exists. A retired brief stays attached to its original answers as a custom brief.

## Report an issue

Use [GitHub Issues](https://github.com/courosa/edtech-under-the-lens/issues) to report a problem or suggest an improvement. Include the activity, steps to reproduce the problem, and browser. Avoid sharing real student information.

## Licenses

- Activity prompts, briefs, instructional prose, and artwork: [CC BY 4.0](CONTENT-LICENSE.md).
- Code (JavaScript, HTML markup, CSS, and deployment scripts): [MIT](LICENSE).

Credit Dr. Alec Couros and identify changes to the content. Participant responses remain their own and are not licensed by this repository.

## Publish updates

GitHub `main` is the source for both live sites. In cPanel, open **Git Version Control**, manage **EdTech Under the Lens**, select **Pull or Deploy**, click **Update from Remote**, then **Deploy HEAD Commit**. Both destinations are updated together. This is a manual deployment workflow, not automatic publication on every commit.

The deployment saves the previous site files outside the public web folders before copying the new version. Browser drafts remain untouched. See `deploy.php` and `.cpanel.yml`. Forks must change the deployment destinations before using this hosting configuration.
