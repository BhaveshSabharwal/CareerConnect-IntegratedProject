import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Target, Compass, Briefcase } from 'lucide-react';
import FlatButton from '../components/ui/FlatButton';

const Home = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="w-full relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32">
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
            style={{ opacity }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-[#0ea5e9] mb-8">
              <Sparkles size={16} />
              <span>AI-Powered Career Intelligence</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              Build Your Future. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] via-[#8b5cf6] to-[#10b981]">
                One Smart Step at a Time.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover your ideal path, craft standout resumes, and land your dream job with a single, intelligent platform designed for your growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <FlatButton variant="primary" className="text-lg px-8 py-4 w-full sm:w-auto">
                Start Your Journey <ArrowRight size={20} />
              </FlatButton>
              <FlatButton variant="outline" className="text-lg px-8 py-4 w-full sm:w-auto">
                Explore Careers
              </FlatButton>
            </div>
          </motion.div>
        </div>

        {/* Abstract Parallax Background Shapes */}
        <motion.div 
          className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[#8b5cf6]/5 blur-[120px] -z-10"
          style={{ y: y1 }}
        />
        <motion.div 
          className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] rounded-full bg-[#0ea5e9]/5 blur-[100px] -z-10"
          style={{ y: y2 }}
        />
      </section>

      {/* Guided Flow Section */}
      <section className="py-24 bg-[#0f172a]/30 relative z-10 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Compass} 
              title="1. Discover" 
              description="Explore AI-curated career paths tailored to your unique skills and passions."
              delay={0.1}
            />
            <FeatureCard 
              icon={Target} 
              title="2. Prepare" 
              description="Build AI-optimized resumes and practice with mock interviews."
              delay={0.2}
            />
            <FeatureCard 
              icon={Briefcase} 
              title="3. Land" 
              description="Apply to personalized job matches with one click and track your success."
              delay={0.3}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5, delay }}
    className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
  >
    <div className="w-12 h-12 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center text-[#0ea5e9] mb-6">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </motion.div>
);

export default Home;
