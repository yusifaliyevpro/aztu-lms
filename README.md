# AzTU LMS Raycast Extension

Access your Azerbaijan Technical University (AzTU) Learning Management System (LMS) data directly from the Raycast command launcher. This extension streamlines everyday student tasks such as checking schedules, reading announcements, reviewing academic records, and more without opening a browser.

## Commands & Features

The extension bundles several commands to surface different areas of the LMS:

### Login Account (Background)

- Launches the AzTU single-sign-on (SSO) flow and opens the LMS dashboard when a fresh login link is required.
- Stores the generated login link locally for reuse within the next hour to reduce repeated authentications.

### Delete Session (Background)

- Clears the cached login link, JWT token, and related timestamps from Raycast LocalStorage.
- Use this command when you want to fully sign out or request a brand-new SSO link.

### Class Schedule

- Displays the weekly timetable with filters for the current, upper, or lower week rotations.
- Highlights the current day, color-codes lecture types, and offers quick copy actions for class details or the entire schedule as Markdown.

### Announcements

- Lists the most recent LMS announcements with quick navigation to detailed content within Raycast.
- Provides a focused search experience to find updates by title.

### Profile Information

- Shows personal and academic profile data including contact information, enrollment details, and helpful shortcuts.
- Includes utility actions such as copying your student ID, exam portal URL, or reusable test exam password.

### Academic Transcript

- Summarizes semester-by-semester performance, earned credits, and averages.
- Offers drill-down views for individual semesters and copy-to-clipboard actions for overall GPA statistics.

### Attendance

- Surfaces attendance metrics for each course with status badges and visual indicators for eligibility.
- Lets you open a detailed view per lecture to review attendance history.

## Configuration

- Open Raycast → Extensions → AzTU LMS → Configure.
- Enter your AzTU LMS **username** and **password** in the provided preferences fields.
- Credentials are used exclusively to generate temporary SSO tokens. Tokens are cached locally for up to one hour and can be purged with the **Delete Session** command.

## Privacy & Data Handling

- Authentication details remain on your machine and are managed through Raycast's secure preferences storage.
- Generated login links and JWT tokens are cached locally to reduce the frequency of login prompts.
- Run the **Delete Session** command at any time to clear cached authentication artifacts.

## Disclaimer

- This project is an independent, voluntary contribution from the community and is **not an official AzTU LMS product**.
- The extension is provided "as is" without any warranty. Use it at your own discretion and risk.
- AzTU or IT team are not affiliated with or responsible for this project.

## Contributing

Contributions, suggestions, and bug reports are welcome! Feel free to open an issue or submit a pull request to improve the extension's reliability and feature set.

## License

This project is released under the MIT License. See the [package metadata](./package.json) for details.

## Acknowledgements

- Built with the [Raycast API](https://developers.raycast.com/).
- LMS data courtesy of AzTU's official systems—thank you to the maintainers of the platform.
