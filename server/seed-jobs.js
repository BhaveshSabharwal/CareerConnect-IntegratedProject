const sequelize = require('./config/db');
const Job = require('./models/Job');

async function run() {
  try {
    await sequelize.sync();
    await Job.destroy({ truncate: true, restartIdentity: true });
    await Job.bulkCreate([
      { title: 'Senior Frontend Engineer', company: 'TechNova', location: 'Remote', type: 'Full-time', salary: '$120k - $150k', tags: ['React', 'TypeScript', 'Tailwind'] },
      { title: 'UX Designer', company: 'CreativePulse', location: 'New York, NY', type: 'Hybrid', salary: '$90k - $110k', tags: ['Figma', 'UI/UX', 'Prototyping'] },
      { title: 'Backend Developer', company: 'DataStream', location: 'San Francisco, CA', type: 'On-site', salary: '$130k - $160k', tags: ['Node.js', 'PostgreSQL', 'AWS'] },
      { title: 'Product Manager', company: 'Visionary', location: 'Remote', type: 'Full-time', salary: '$110k - $140k', tags: ['Agile', 'Strategy', 'Jira'] }
    ]);
    console.log('✅ Jobs table created and seeded!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await sequelize.close();
  }
}

run();
