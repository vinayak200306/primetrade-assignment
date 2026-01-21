import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = ({ tasks }) => {
  const events = tasks
    .filter((task) => task.dueDate)
    .map((task) => ({
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: true,
    }));

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-12 text-center text-slate-600">
        <p className="text-lg font-semibold mb-2">No scheduled tasks</p>
        <p className="text-sm">Add a due date to tasks to see them here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 h-[600px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day']}
        popup
      />
    </div>
  );
};

export default CalendarView;
