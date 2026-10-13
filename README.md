# National Attendance

A responsive employee attendance dashboard built with React and Vite. The frontend starts with demo data and includes employee management, daily clock-in and clock-out, attendance history, monthly reports, and an estimated payroll view.

## Get started

```sh
npm install
npm run dev
```

To create and preview a production build:

```sh
npm run build
npm run preview
```

## Demo features

- Dashboard attendance summary and weekly overview
- Employee directory with search, department filter, and an add-employee form
- Quick clock-in and clock-out controls
- Attendance history with date and status filters, plus CSV export
- Monthly attendance and department reports
- Salary estimate prorated over 22 working days using demo absence data

The demo stores changes only in browser memory. Reloading the page restores the sample data. Authentication, persistent storage, GPS geofencing, and face verification are not implemented. Face verification must not be treated as available without a secure backend and liveness detection.

## GitHub Pages

The Vite base path is configured as `/attendance-/`. The GitHub Actions workflow in `.github/workflows/deploy.yml` builds the site and publishes the `dist` artifact when changes are pushed to `main` or the workflow is run manually. Enable GitHub Pages for the repository and select **GitHub Actions** as the deployment source.
