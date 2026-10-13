import { useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  Ellipsis,
  FileClock,
  FileText,
  Filter,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
  X,
} from 'lucide-react'

const seedEmployees = [
  { id: 'EMP-001', name: 'Olivia Rhye', role: 'Product Designer', department: 'Design', email: 'olivia.rhye@national.com', salary: 6400, avatar: 'OR', color: 'rose', absentDays: 0 },
  { id: 'EMP-002', name: 'Phoenix Baker', role: 'Engineering Lead', department: 'Engineering', email: 'phoenix.baker@national.com', salary: 8200, avatar: 'PB', color: 'purple', absentDays: 1 },
  { id: 'EMP-003', name: 'Lana Steiner', role: 'People Operations', department: 'People', email: 'lana.steiner@national.com', salary: 5800, avatar: 'LS', color: 'blue', absentDays: 0 },
  { id: 'EMP-004', name: 'Demi Wilkinson', role: 'Product Manager', department: 'Product', email: 'demi.wilkinson@national.com', salary: 7100, avatar: 'DW', color: 'orange', absentDays: 2 },
  { id: 'EMP-005', name: 'Candice Wu', role: 'UX Researcher', department: 'Design', email: 'candice.wu@national.com', salary: 6200, avatar: 'CW', color: 'green', absentDays: 0 },
  { id: 'EMP-006', name: 'Natali Craig', role: 'Frontend Developer', department: 'Engineering', email: 'natali.craig@national.com', salary: 6800, avatar: 'NC', color: 'yellow', absentDays: 1 },
  { id: 'EMP-007', name: 'Drew Cano', role: 'Marketing Manager', department: 'Marketing', email: 'drew.cano@national.com', salary: 6000, avatar: 'DC', color: 'teal', absentDays: 0 },
  { id: 'EMP-008', name: 'Orlando Diggs', role: 'Customer Success', department: 'Operations', email: 'orlando.diggs@national.com', salary: 5200, avatar: 'OD', color: 'pink', absentDays: 3 },
]

const today = new Date()
const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const todayKey = dateKey(today)
const todayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(today)
const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(today)

const seedRecords = seedEmployees.map((employee, index) => ({
  employeeId: employee.id,
  date: todayKey,
  status: ['present', 'present', 'present', 'late', 'present', 'absent', 'present', 'on-leave'][index],
  checkIn: ['08:52 AM', '08:45 AM', '08:57 AM', '09:18 AM', '08:41 AM', '—', '08:49 AM', '—'][index],
  checkOut: ['05:06 PM', '05:12 PM', '05:02 PM', '—', '04:58 PM', '—', '05:09 PM', '—'][index],
}))

const seedHistory = (() => {
  const history = []
  let weekdaysAdded = 0
  for (let daysAgo = 1; weekdaysAdded < 6; daysAgo += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - daysAgo)
    if (date.getDay() === 0 || date.getDay() === 6) continue
    weekdaysAdded += 1
    seedEmployees.forEach((employee, index) => {
      const pattern = (index + daysAgo) % 17
      const status = pattern === 0 ? 'absent' : pattern === 1 ? 'on-leave' : pattern === 2 || pattern === 7 ? 'late' : 'present'
      history.push({
        employeeId: employee.id,
        date: dateKey(date),
        status,
        checkIn: status === 'absent' || status === 'on-leave' ? '—' : status === 'late' ? '09:14 AM' : '08:52 AM',
        checkOut: status === 'absent' || status === 'on-leave' ? '—' : '05:06 PM',
      })
    })
  }
  return history
})()

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Employees', icon: UsersRound },
  { label: 'Attendance', icon: FileClock },
  { label: 'Reports', icon: FileText },
  { label: 'Payroll', icon: Banknote },
]

const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function Avatar({ employee, size = '' }) {
  return <span className={`avatar avatar-${employee.color} ${size}`}>{employee.avatar}</span>
}

function StatusBadge({ status }) {
  const names = { present: 'Present', late: 'Late', absent: 'Absent', 'on-leave': 'On leave' }
  return <span className={`status-badge status-${status}`}><span />{names[status] || status}</span>
}

function IconButton({ label, children, onClick, className = '' }) {
  return <button aria-label={label} className={`icon-button ${className}`} onClick={onClick}>{children}</button>
}

function App() {
  const [page, setPage] = useState('Dashboard')
  const [employees, setEmployees] = useState(seedEmployees)
  const [records, setRecords] = useState([...seedRecords, ...seedHistory])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [selectedDate, setSelectedDate] = useState(todayKey)
  const [isEmployeeModalOpen, setEmployeeModalOpen] = useState(false)
  const [isClockModalOpen, setClockModalOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const todayRecords = useMemo(() => records.filter((record) => record.date === todayKey), [records])
  const presentCount = todayRecords.filter((record) => record.status === 'present' || record.status === 'late').length
  const lateCount = todayRecords.filter((record) => record.status === 'late').length
  const absentCount = todayRecords.filter((record) => record.status === 'absent').length
  const filteredEmployees = useMemo(() => employees.filter((employee) => {
    const text = `${employee.name} ${employee.role} ${employee.department} ${employee.email}`.toLowerCase()
    return text.includes(query.toLowerCase())
  }), [employees, query])
  const visibleRecords = useMemo(() => records
    .filter((record) => selectedDate === 'all' || record.date === selectedDate)
    .filter((record) => statusFilter === 'All statuses' || record.status === statusFilter)
    .filter((record) => {
      const employee = employees.find((item) => item.id === record.employeeId)
      return employee && `${employee.name} ${employee.department} ${employee.id}`.toLowerCase().includes(query.toLowerCase())
    }), [records, employees, selectedDate, statusFilter, query])

  function updateRecord(employeeId, status, checkIn, checkOut) {
    setRecords((current) => {
      const existing = current.find((record) => record.employeeId === employeeId && record.date === todayKey)
      if (existing) {
        return current.map((record) => record === existing
          ? { ...record, status, checkIn: checkIn ?? record.checkIn, checkOut: checkOut ?? record.checkOut }
          : record)
      }
      return [...current, { employeeId, date: todayKey, status, checkIn: checkIn || '—', checkOut: checkOut || '—' }]
    })
  }

  function clockEmployee(employeeId) {
    const existing = todayRecords.find((record) => record.employeeId === employeeId)
    const time = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date())
    if (existing?.checkIn !== '—' && existing?.checkOut === '—') {
      updateRecord(employeeId, existing.status === 'late' ? 'late' : 'present', undefined, time)
      setNotice('Clock-out recorded. Have a great evening!')
    } else {
      updateRecord(employeeId, 'present', time, '—')
      setNotice('Clock-in recorded. You’re all set!')
    }
    window.setTimeout(() => setNotice(''), 3000)
    setClockModalOpen(false)
  }

  function addEmployee(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = data.get('name').trim()
    const newEmployee = {
      id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      name,
      role: data.get('role').trim(),
      department: data.get('department'),
      email: data.get('email').trim(),
      salary: Number(data.get('salary')) || 0,
      avatar: name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
      color: ['teal', 'orange', 'purple', 'blue'][employees.length % 4],
      absentDays: 0,
    }
    setEmployees((current) => [...current, newEmployee])
    setEmployeeModalOpen(false)
    setNotice(`${name} has been added to your team.`)
    window.setTimeout(() => setNotice(''), 3000)
  }

  function downloadCsv() {
    const rows = [['Employee ID', 'Name', 'Department', 'Date', 'Status', 'Clock in', 'Clock out']]
    visibleRecords.forEach((record) => {
      const employee = employees.find((item) => item.id === record.employeeId)
      rows.push([employee.id, employee.name, employee.department, record.date, record.status, record.checkIn, record.checkOut])
    })
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    link.download = `national-attendance-${selectedDate === 'all' ? 'history' : selectedDate}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setPage('Dashboard'); setMobileNavOpen(false) }}>
          <span className="brand-mark"><span /><span /><span /><span /></span>
          <span className="brand-wordmark">national<span>.</span></span>
        </a>
        <div className="workspace-switcher">
          <span className="workspace-avatar">N</span>
          <span className="workspace-copy"><strong>National Co.</strong><small>Workspace</small></span>
          <ChevronDown size={15} />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-link ${page === label ? 'nav-link-active' : ''}`} onClick={() => { setPage(label); setMobileNavOpen(false) }}>
              <Icon size={19} strokeWidth={1.8} /><span>{label}</span>
              {label === 'Attendance' && <span className="nav-count">{todayRecords.length}</span>}
            </button>
          ))}
        </nav>
        <div className="nav-label tools-label">TOOLS</div>
        <button className="nav-link" onClick={() => setNotice('Your workspace preferences are up to date.')}><Settings2 size={19} strokeWidth={1.8} /><span>Settings</span></button>
        <button className="nav-link" onClick={() => setNotice('Help is on the way — contact your workspace admin.')}><CircleHelp size={19} strokeWidth={1.8} /><span>Help & support</span></button>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span className="upgrade-icon"><Sparkles size={16} /></span>
            <strong>Make work feel lighter</strong>
            <p>Everything your team needs, all in one place.</p>
            <button onClick={() => setNotice('You’re already using the National workspace.')}>Explore workspace <ArrowRight size={14} /></button>
          </div>
          <button className="profile-button" onClick={() => setNotice('Signed in as Sarah Chen · Administrator')}>
            <span className="avatar avatar-admin">SC</span>
            <span className="profile-info"><strong>Sarah Chen</strong><small>Admin</small></span>
            <MoreHorizontal size={20} className="profile-more" />
          </button>
        </div>
      </aside>

      {mobileNavOpen && <button className="mobile-backdrop" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-start">
            <IconButton label="Open navigation" className="mobile-menu" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></IconButton>
            <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={15} /><strong>{page}</strong></div>
          </div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search anything..." aria-label="Search" />
              <kbd>⌘ K</kbd>
            </label>
            <span className="topbar-divider" />
            <span className="today-top"><CalendarDays size={16} />{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(today)}</span>
            <IconButton label="Notifications" className="notification-button" onClick={() => setNotice('You’re all caught up!')}><Bell size={19} /><i /></IconButton>
            <Avatar employee={{ avatar: 'SC', color: 'admin' }} />
          </div>
        </header>

        <div className="page-content">
          {page === 'Dashboard' && <Dashboard
            employees={employees} records={todayRecords} presentCount={presentCount} lateCount={lateCount}
            absentCount={absentCount} onClock={() => setClockModalOpen(true)}
            onNavigate={setPage} onAdd={() => setEmployeeModalOpen(true)}
          />}
          {page === 'Employees' && <EmployeesPage employees={filteredEmployees} query={query} onAdd={() => setEmployeeModalOpen(true)} />}
          {page === 'Attendance' && <AttendancePage
            employees={employees} records={visibleRecords} selectedDate={selectedDate} setSelectedDate={setSelectedDate}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter} onExport={downloadCsv}
          />}
          {page === 'Reports' && <ReportsPage employees={employees} records={records} onExport={downloadCsv} />}
          {page === 'Payroll' && <PayrollPage employees={employees} />}
        </div>
      </main>

      {notice && <div className="toast"><span className="toast-check"><Check size={14} /></span>{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={15} /></button></div>}
      {isEmployeeModalOpen && <EmployeeModal onClose={() => setEmployeeModalOpen(false)} onSubmit={addEmployee} />}
      {isClockModalOpen && <ClockModal employees={employees} records={todayRecords} onClose={() => setClockModalOpen(false)} onClock={clockEmployee} />}
    </div>
  )
}

function PageHeading({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="page-heading">
      <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>
      {actions && <div className="heading-actions">{actions}</div>}
    </div>
  )
}

function Dashboard({ employees, records, presentCount, lateCount, absentCount, onClock, onNavigate, onAdd }) {
  const activeRecords = records.filter((record) => record.status === 'present' || record.status === 'late')
  const bars = [56, 72, 64, 86, 74, 92, 69]
  return (
    <>
      <PageHeading
        eyebrow={todayLabel}
        title={<>Good morning, Sarah <span className="title-wave">✳</span></>}
        subtitle="Here’s what’s happening with your team today."
        actions={<><button className="button button-secondary" onClick={() => onNavigate('Reports')}><Download size={16} />Export report</button><button className="button button-primary" onClick={onClock}><Clock3 size={16} />Quick clock</button></>}
      />
      <div className="stats-grid">
        <StatCard label="Total employees" value={String(employees.length).padStart(2, '0')} change="+2 this month" direction="up" icon={UsersRound} tint="violet" foot="across 5 departments" />
        <StatCard label="Present today" value={`${presentCount}/${employees.length}`} change="+4.8%" direction="up" icon={Check} tint="mint" foot="vs. last Monday" />
        <StatCard label="Late arrivals" value={String(lateCount).padStart(2, '0')} change={lateCount > 0 ? `${lateCount} needs attention` : 'Looking good'} direction={lateCount > 0 ? 'down' : 'up'} icon={Clock3} tint="amber" foot="today so far" />
        <StatCard label="Absent today" value={String(absentCount).padStart(2, '0')} change="View attendance" direction="link" icon={CalendarDays} tint="blue" foot="including approved leave" />
      </div>
      <div className="overview-grid">
        <section className="panel attendance-chart-panel">
          <div className="panel-heading">
            <div><h2>Attendance overview</h2><p>Daily attendance rate this week</p></div>
            <button className="select-button">This week <ChevronDown size={15} /></button>
          </div>
          <div className="chart-summary"><strong>94.2%</strong><span className="trend-pill"><ArrowUpRight size={14} /> 4.8%</span><small>vs. last week</small></div>
          <div className="chart" role="img" aria-label="Attendance rate over the last seven days">
            <div className="chart-axis"><span>100%</span><span>75%</span><span>50%</span><span>25%</span></div>
            <div className="chart-plot">
              <div className="chart-grid-lines"><i /><i /><i /><i /></div>
              <div className="chart-bars">{bars.map((height, index) => <div className="chart-column" key={weekdayNames[index]}><span className={`bar ${index === 4 ? 'bar-highlight' : ''}`} style={{ height: `${height}%` }} />{index === 4 && <em>96%</em>}<small>{weekdayNames[index]}</small></div>)}</div>
            </div>
          </div>
        </section>
        <section className="panel breakdown-panel">
          <div className="panel-heading"><div><h2>Today at a glance</h2><p>{todayLabel}</p></div><IconButton label="Attendance details" onClick={() => onNavigate('Attendance')}><Ellipsis size={19} /></IconButton></div>
          <div className="donut-wrap"><div className="donut"><div className="donut-center"><strong>{employees.length ? Math.round((presentCount / employees.length) * 100) : 0}%</strong><small>present</small></div></div></div>
          <div className="breakdown-list">
            <BreakdownRow color="green" label="On time" value={records.filter((record) => record.status === 'present').length} total={employees.length} />
            <BreakdownRow color="orange" label="Late arrivals" value={records.filter((record) => record.status === 'late').length} total={employees.length} />
            <BreakdownRow color="gray" label="Absent" value={records.filter((record) => record.status === 'absent').length} total={employees.length} />
            <BreakdownRow color="purple" label="On leave" value={records.filter((record) => record.status === 'on-leave').length} total={employees.length} />
          </div>
        </section>
      </div>
      <section className="panel table-panel dashboard-table">
        <div className="panel-heading table-panel-heading">
          <div><h2>Today’s attendance</h2><p>Stay up to date with who’s here.</p></div>
          <div className="table-actions"><button className="button button-tertiary" onClick={onAdd}><Plus size={16} />Add employee</button><button className="text-link" onClick={() => onNavigate('Attendance')}>View all <ArrowRight size={15} /></button></div>
        </div>
        <AttendanceTable employees={employees} records={records} compact />
      </section>
    </>
  )
}

function StatCard({ label, value, change, direction, icon: Icon, tint, foot }) {
  return (
    <section className="panel stat-card">
      <div className="stat-top"><span>{label}</span><span className={`stat-icon tint-${tint}`}><Icon size={17} /></span></div>
      <div className="stat-value">{value}</div>
      <div className="stat-foot"><span className={`stat-change ${direction === 'down' ? 'change-down' : direction === 'link' ? 'change-link' : ''}`}>{direction === 'down' ? <ArrowDownRight size={14} /> : direction === 'link' ? <ArrowRight size={14} /> : <ArrowUpRight size={14} />}{change}</span><span>{foot}</span></div>
    </section>
  )
}

function BreakdownRow({ color, label, value, total }) {
  return <div className="breakdown-row"><span className={`legend-dot dot-${color}`} /><span>{label}</span><strong>{value}</strong><div className="mini-track"><i style={{ width: `${total ? value / total * 100 : 0}%` }} /></div></div>
}

function AttendanceTable({ employees, records, compact = false, emptyText = 'No attendance records found.' }) {
  const shownRecords = compact ? records.slice(0, 5) : records
  if (!shownRecords.length) return <div className="empty-state"><CalendarDays size={24} /><strong>Nothing to show yet</strong><span>{emptyText}</span></div>
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead><tr><th>EMPLOYEE</th><th>DEPARTMENT</th>{!compact && <th>DATE</th>}<th>CHECK IN</th><th>CHECK OUT</th><th>STATUS</th></tr></thead>
        <tbody>{shownRecords.map((record) => {
          const employee = employees.find((item) => item.id === record.employeeId)
          if (!employee) return null
          return <tr key={`${record.employeeId}-${record.date}`}>
            <td><div className="employee-cell"><Avatar employee={employee} /><span><strong>{employee.name}</strong><small>{employee.role}</small></span></div></td>
            <td><span className="department-text">{employee.department}</span></td>
            {!compact && <td>{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${record.date}T12:00:00`))}</td>}
            <td className={record.checkIn === '—' ? 'muted-cell' : ''}>{record.checkIn}</td><td className={record.checkOut === '—' ? 'muted-cell' : ''}>{record.checkOut}</td><td><StatusBadge status={record.status} /></td>
          </tr>
        })}</tbody>
      </table>
    </div>
  )
}

function EmployeesPage({ employees, query, onAdd }) {
  const [department, setDepartment] = useState('All departments')
  const departments = ['All departments', ...new Set(seedEmployees.map((employee) => employee.department))]
  const shown = employees.filter((employee) => department === 'All departments' || employee.department === department)
  return (
    <>
      <PageHeading eyebrow="YOUR PEOPLE" title="Employees" subtitle="Manage your people, their roles, and team details." actions={<button className="button button-primary" onClick={onAdd}><Plus size={16} />Add employee</button>} />
      <section className="panel table-panel full-table-panel">
        <div className="employee-toolbar"><div className="panel-title-group"><h2>All employees <span className="count-pill">{employees.length}</span></h2><p>A directory of everyone on your team.</p></div><div className="filter-actions"><label className="table-search"><Search size={16} /><input placeholder="Search employees" value={query} readOnly /></label><label className="select-button select-label"><Filter size={15} /><select value={department} onChange={(event) => setDepartment(event.target.value)}>{departments.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></label></div></div>
        {shown.length ? <div className="table-scroll"><table className="data-table employee-directory"><thead><tr><th>NAME</th><th>DEPARTMENT</th><th>EMPLOYEE ID</th><th>EMAIL</th><th>MONTHLY SALARY</th><th /></tr></thead><tbody>{shown.map((employee) => <tr key={employee.id}><td><div className="employee-cell"><Avatar employee={employee} /><span><strong>{employee.name}</strong><small>{employee.role}</small></span></div></td><td><span className="department-text">{employee.department}</span></td><td className="id-cell">{employee.id}</td><td className="email-cell">{employee.email}</td><td className="money-cell">${employee.salary.toLocaleString()}</td><td><IconButton label={`More options for ${employee.name}`}><Ellipsis size={18} /></IconButton></td></tr>)}</tbody></table></div> : <div className="empty-state"><Search size={24} /><strong>No employees found</strong><span>Try another search or department.</span></div>}
        <div className="table-footer"><span>Showing <strong>{shown.length}</strong> of <strong>{employees.length}</strong> employees</span><div><button className="pagination-button" disabled><ArrowLeft size={14} />Previous</button><button className="pagination-button">Next<ArrowRight size={14} /></button></div></div>
      </section>
      <div className="privacy-note"><span className="privacy-dot" />Employee data is stored locally in this demo workspace.</div>
    </>
  )
}

function AttendancePage({ employees, records, selectedDate, setSelectedDate, statusFilter, setStatusFilter, onExport }) {
  const filterToday = () => { setSelectedDate(todayKey); setStatusFilter('All statuses') }
  return (
    <>
      <PageHeading eyebrow="TEAM TIME" title="Attendance" subtitle="A clear view of arrivals, departures, and time away." actions={<button className="button button-secondary" onClick={onExport}><Download size={16} />Export CSV</button>} />
      <div className="attendance-summary">
        <div><span>On time</span><strong>{records.filter((record) => record.status === 'present').length.toString().padStart(2, '0')}</strong><small>Within scheduled hours</small></div>
        <div><span>Late arrivals</span><strong>{records.filter((record) => record.status === 'late').length.toString().padStart(2, '0')}</strong><small>After 9:00 AM</small></div>
        <div><span>Absent</span><strong>{records.filter((record) => record.status === 'absent').length.toString().padStart(2, '0')}</strong><small>Not checked in</small></div>
        <div><span>On leave</span><strong>{records.filter((record) => record.status === 'on-leave').length.toString().padStart(2, '0')}</strong><small>Approved time away</small></div>
      </div>
      <section className="panel table-panel full-table-panel attendance-history">
        <div className="employee-toolbar"><div className="panel-title-group"><h2>Attendance history</h2><p>Records are updated as your team clocks in and out.</p></div><div className="filter-actions"><label className="select-button select-label"><CalendarDays size={15} /><select value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)}><option value={todayKey}>Today · {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(today)}</option><option value="all">All records</option>{Array.from({ length: 7 }, (_, index) => { const date = new Date(today); date.setDate(today.getDate() - index); const key = dateKey(date); return <option key={key} value={key}>{new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date)}</option> })}</select><ChevronDown size={14} /></label><label className="select-button select-label"><SlidersHorizontal size={15} /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option><option value="present">Present</option><option value="late">Late</option><option value="absent">Absent</option><option value="on-leave">On leave</option></select><ChevronDown size={14} /></label></div></div>
        <AttendanceTable employees={employees} records={records} emptyText="Try adjusting your date or status filters." />
        <div className="table-footer"><span>Showing <strong>{records.length}</strong> attendance records</span><div><button className="pagination-button" disabled><ArrowLeft size={14} />Previous</button><button className="pagination-button" onClick={filterToday}>Today<ArrowRight size={14} /></button></div></div>
      </section>
    </>
  )
}

function ReportsPage({ employees, records, onExport }) {
  const totalDays = employees.length * 22
  const attendedDays = Math.max(totalDays - employees.reduce((sum, employee) => sum + employee.absentDays, 0), 0)
  const rate = totalDays ? (attendedDays / totalDays * 100).toFixed(1) : '0.0'
  const weeklyBars = [74, 82, 77, 90, 85, 96, 88, 91, 80, 93, 86, 100]
  return (
    <>
      <PageHeading eyebrow="INSIGHTS" title="Reports" subtitle="A thoughtful overview of your team's attendance." actions={<button className="button button-secondary" onClick={onExport}><Download size={16} />Download report</button>} />
      <div className="report-month-picker"><button aria-label="Previous month"><ChevronLeft size={17} /></button><CalendarDays size={16} /><strong>{monthLabel}</strong><button aria-label="Next month"><ChevronRight size={17} /></button><span className="live-indicator">Current month</span></div>
      <div className="report-stats">
        <div className="panel report-stat"><span>Attendance rate</span><strong>{rate}%</strong><small><span className="positive-note"><ArrowUpRight size={13} />2.4%</span> vs. previous month</small></div>
        <div className="panel report-stat"><span>Days present</span><strong>{attendedDays.toLocaleString()}</strong><small>out of {totalDays.toLocaleString()} scheduled days</small></div>
        <div className="panel report-stat"><span>Late arrivals</span><strong>{records.filter((record) => record.status === 'late').length + 12}</strong><small>Across all departments</small></div>
        <div className="panel report-stat"><span>Time off</span><strong>{employees.reduce((sum, employee) => sum + employee.absentDays, 0) + 8} days</strong><small>Planned and unplanned</small></div>
      </div>
      <section className="panel report-chart-panel">
        <div className="panel-heading"><div><h2>Attendance trends</h2><p>Average daily attendance throughout {monthLabel}</p></div><button className="select-button">By week <ChevronDown size={15} /></button></div>
        <div className="report-graph"><div className="report-y-labels"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div className="report-plot"><div className="report-lines"><i /><i /><i /><i /><i /></div><div className="report-bars">{weeklyBars.map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div><div className="report-x-labels">{['Oct 1', 'Oct 3', 'Oct 5', 'Oct 7', 'Oct 9', 'Oct 11', 'Oct 13', 'Oct 15', 'Oct 17', 'Oct 19', 'Oct 21', 'Oct 23'].map((label) => <small key={label}>{label}</small>)}</div></div></div>
      </section>
      <section className="panel report-departments"><div className="panel-heading"><div><h2>By department</h2><p>How each team is showing up this month.</p></div><button className="text-link" onClick={() => window.print()}>Print report <ArrowRight size={15} /></button></div><div className="department-report-list">{['Engineering', 'Design', 'People', 'Product', 'Operations'].map((department, index) => { const percent = [96, 94, 98, 91, 89][index]; return <div className="department-report-row" key={department}><span>{department}</span><div className="department-track"><i style={{ width: `${percent}%` }} /></div><strong>{percent}%</strong><span className="department-change"><ArrowUpRight size={13} />{[3.2, 1.8, 4.1, 2.4, 1.2][index]}%</span></div> })}</div></section>
    </>
  )
}

function PayrollPage({ employees }) {
  const workingDays = 22
  const grossTotal = employees.reduce((sum, employee) => sum + employee.salary, 0)
  const deductionsTotal = employees.reduce((sum, employee) => sum + employee.salary / workingDays * employee.absentDays, 0)
  const netTotal = grossTotal - deductionsTotal
  return (
    <>
      <PageHeading eyebrow="PEOPLE, PAID RIGHT" title="Payroll" subtitle="A simple salary estimate based on this month's attendance." actions={<button className="button button-primary" onClick={() => window.print()}><Download size={16} />Export payroll</button>} />
      <div className="report-month-picker"><button aria-label="Previous month"><ChevronLeft size={17} /></button><CalendarDays size={16} /><strong>{monthLabel}</strong><button aria-label="Next month"><ChevronRight size={17} /></button><span className="live-indicator">Draft estimate</span></div>
      <div className="payroll-summary">
        <div className="panel payroll-total"><span>Estimated net payroll</span><strong>${netTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong><small><Banknote size={14} /> Based on {employees.length} employees</small></div>
        <div className="panel payroll-mini"><span>Gross payroll</span><strong>${grossTotal.toLocaleString()}</strong><small>Before attendance adjustments</small></div>
        <div className="panel payroll-mini"><span>Attendance deductions</span><strong className="deduction-value">−${deductionsTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong><small>{employees.reduce((sum, employee) => sum + employee.absentDays, 0)} unpaid days · pro-rated</small></div>
      </div>
      <section className="panel table-panel full-table-panel payroll-table">
        <div className="employee-toolbar"><div className="panel-title-group"><h2>Salary breakdown</h2><p>Estimated monthly salary by employee · {workingDays} working days</p></div><span className="calculation-note"><Sparkles size={15} />Calculated automatically</span></div>
        <div className="table-scroll"><table className="data-table"><thead><tr><th>EMPLOYEE</th><th>WORKING DAYS</th><th>ABSENT DAYS</th><th>GROSS SALARY</th><th>DEDUCTIONS</th><th>ESTIMATED NET</th></tr></thead><tbody>{employees.map((employee) => { const deduction = employee.salary / workingDays * employee.absentDays; return <tr key={employee.id}><td><div className="employee-cell"><Avatar employee={employee} /><span><strong>{employee.name}</strong><small>{employee.role}</small></span></div></td><td>{workingDays - employee.absentDays} / {workingDays}</td><td>{employee.absentDays ? <span className="absence-count">{employee.absentDays} days</span> : <span className="no-absence">—</span>}</td><td className="money-cell">${employee.salary.toLocaleString()}</td><td className="deduction-cell">{deduction ? `−$${deduction.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '—'}</td><td className="money-cell net-cell">${(employee.salary - deduction).toLocaleString('en-US', { maximumFractionDigits: 0 })}</td></tr> })}</tbody><tfoot><tr><td colSpan="3">Total payroll</td><td>${grossTotal.toLocaleString()}</td><td className="deduction-cell">−${deductionsTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td><td className="net-cell">${netTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td></tr></tfoot></table></div>
      </section>
      <div className="payroll-disclaimer"><CircleHelp size={16} /><span><strong>Demo estimate only.</strong> Salary is prorated over 22 working days using demo absence data. This is not a payment instruction or a substitute for your organization's payroll policies.</span></div>
    </>
  )
}

function EmployeeModal({ onClose, onSubmit }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="employee-modal-title">
        <div className="modal-heading"><div><span className="modal-icon"><UsersRound size={19} /></span><h2 id="employee-modal-title">Add a teammate</h2><p>Fill in a few details to grow your team.</p></div><IconButton label="Close dialog" onClick={onClose}><X size={19} /></IconButton></div>
        <form onSubmit={onSubmit}>
          <label className="form-field">Full name<input name="name" placeholder="e.g. Jamie Rivera" required /></label>
          <label className="form-field">Work email<input name="email" type="email" placeholder="jamie@company.com" required /></label>
          <div className="form-row"><label className="form-field">Job title<input name="role" placeholder="e.g. Designer" required /></label><label className="form-field">Department<select name="department" defaultValue="Engineering"><option>Engineering</option><option>Design</option><option>People</option><option>Product</option><option>Marketing</option><option>Operations</option></select></label></div>
          <label className="form-field">Monthly salary <span className="input-with-prefix"><span>$</span><input name="salary" type="number" min="0" placeholder="5,000" required /></span></label>
          <div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary"><Plus size={16} />Add employee</button></div>
        </form>
      </section>
    </div>
  )
}

function ClockModal({ employees, records, onClose, onClock }) {
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || '')
  const selectedRecord = records.find((record) => record.employeeId === employeeId)
  const needsClockOut = selectedRecord?.checkIn !== '—' && selectedRecord?.checkOut === '—'
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="modal clock-modal" role="dialog" aria-modal="true" aria-labelledby="clock-modal-title">
        <div className="modal-heading"><div><span className="modal-icon clock-icon"><Clock3 size={19} /></span><h2 id="clock-modal-title">Quick clock</h2><p>Record an attendance punch for a teammate.</p></div><IconButton label="Close dialog" onClick={onClose}><X size={19} /></IconButton></div>
        <label className="form-field">Choose employee<select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name} · {employee.department}</option>)}</select></label>
        {selectedRecord?.checkIn !== '—' && selectedRecord && <div className="clock-status"><Check size={16} /><span>Clocked in at <strong>{selectedRecord.checkIn}</strong>{needsClockOut ? ' · ready to clock out' : selectedRecord.checkOut !== '—' ? ` · clocked out at ${selectedRecord.checkOut}` : ''}</span></div>}
        <div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button type="button" className="button button-primary" onClick={() => onClock(employeeId)}>{needsClockOut ? <><LogOut size={16} />Clock out</> : <><LogIn size={16} />Clock in</>}</button></div>
      </section>
    </div>
  )
}

export default App
