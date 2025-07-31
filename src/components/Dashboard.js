import React, { useState, useEffect } from 'react';
import { translations, mockChats } from '../data';
import Chart from 'react-apexcharts';
import { Users, MessageSquare, ArrowUpRight, UserPlus, Bell, Activity, TrendingUp, Eye, Clock, Target, Car, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';


const GlassCard = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      className={`
        backdrop-blur-xl bg-white/10 dark:bg-slate-800/20
        border border-white/20 dark:border-slate-700/50
        rounded-2xl shadow-lg
        transform transition-all duration-700 ease-out
        hover:scale-[1.02] hover:shadow-3xl hover:bg-white/15 dark:hover:bg-slate-800/30
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedNumber = ({ value, duration = 2000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easedProgress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

const StatCard = ({ icon, title, value, change, changeType, index, gradient, accentColor }) => {
  return (
    <GlassCard delay={index * 150}>
      <div className="relative overflow-hidden group">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor}15, transparent 70%)`
          }}
        />

        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
              {React.cloneElement(icon, {
                size: 24,
                className: "text-white drop-shadow-lg"
              })}
            </div>
            {change && (
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-bold ${
                changeType === 'increase'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                <ArrowUpRight size={14} className={changeType === 'increase' ? '' : 'transform rotate-180'} />
                <span>{change}</span>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mb-2">{title}</p>
            <p className="text-3xl font-bold text-slate-700 dark:text-white mb-1">
              <AnimatedNumber value={value} />
            </p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sky-400/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </div>
      </div>
    </GlassCard>
  );
};

const PulseIndicator = ({ color = "bg-sky-500", size = "w-3 h-3" }) => (
  <div className="relative">
    <div className={`${size} ${color} rounded-full`} />
    <div className={`absolute inset-0 ${size} ${color} rounded-full animate-ping opacity-75`} />
  </div>
);

const Dashboard = ({ language, darkMode }) => {
  const t = translations[language];

  const totalUsers = mockChats.length;
  const activeUsers = mockChats.filter(chat => chat.isOnline).length;
  const totalChats = mockChats.reduce((sum, chat) => sum + chat.totalChats, 0);

  const chatsByDay = mockChats.reduce((acc, chat) => {
    const date = new Date(chat.lastChatDate).toLocaleDateString(language, { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const usersByRegion = mockChats.reduce((acc, chat) => {
    acc[chat.region] = (acc[chat.region] || 0) + 1;
    return acc;
  }, {});

  const usersByCarModel = mockChats.reduce((acc, chat) => {
    acc[chat.carModel] = (acc[chat.carModel] || 0) + 1;
    return acc;
  }, {});

  const apexBarChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      foreColor: darkMode ? '#e2e8f0' : '#475569',
      fontFamily: 'Poppins, sans-serif',
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: Object.keys(usersByCarModel),
      labels: {
        style: {
          colors: darkMode ? '#94a3b8' : '#64748b'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: darkMode ? '#94a3b8' : '#64748b'
        }
      }
    },
    grid: {
      borderColor: darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)',
    },
    tooltip: {
      theme: darkMode ? 'dark' : 'light',
      y: {
        formatter: function (val) {
          return val + " users"
        }
      }
    },
    colors: ['#38bdf8'],
  };

  const apexBarChartSeries = [{
    name: 'Users',
    data: Object.values(usersByCarModel)
  }];
 
   const apexAreaChartOptions = {
     chart: {
       toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: darkMode ? '#e2e8f0' : '#475569',
      fontFamily: 'Poppins, sans-serif',
      background: 'transparent',
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 4,
      colors: ['#0ea5e9']
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.8,
        gradientToColors: ['#0284c7'],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    grid: {
      borderColor: darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)',
      strokeDashArray: 4,
    },
    xaxis: {
      categories: Object.keys(chatsByDay).slice(-7),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: darkMode ? '#94a3b8' : '#64748b'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (val) => Math.floor(val),
        style: {
          colors: darkMode ? '#94a3b8' : '#64748b'
        }
      }
    },
    tooltip: {
      theme: darkMode ? 'dark' : 'light',
      x: { show: false },
      style: {
        fontSize: '12px',
        fontFamily: 'Poppins, sans-serif',
      }
    },
    legend: { show: false },
    colors: ['#0ea5e9'],
  };

  const apexAreaChartSeries = [{
    name: t.dashboardTotalChats,
    data: Object.values(chatsByDay).slice(-7)
  }];

  const apexBarChartOptionsForRegion = {
    chart: {
      type: 'bar',
      height: 200,
      toolbar: { show: false },
      foreColor: darkMode ? '#e2e8f0' : '#475569',
      fontFamily: 'Poppins, sans-serif',
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '55%',
        distributed: true,
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -25,
      style: {
        fontSize: '12px',
        colors: [darkMode ? '#e2e8f0' : '#334155']
      }
    },
    xaxis: {
      categories: Object.keys(usersByRegion),
      labels: {
        show: true,
        rotate: 0,
        hideOverlappingLabels: true,
        trim: true,
        style: {
          colors: darkMode ? '#94a3b8' : '#64748b',
          fontSize: '12px'
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: "vertical",
        shadeIntensity: 0.5,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    colors: ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e'],
  };

  const apexBarChartSeriesForRegion = [{
    name: 'Users',
    data: Object.values(usersByRegion)
  }];

  return (
    <div className="flex-1 p-6 md:p-8 bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-y-auto relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <motion.header
        className="flex justify-between items-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-sky-600 dark:from-white dark:to-sky-300 bg-clip-text text-transparent tracking-tight">
            {t.dashboard}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-300"
          >
            <Bell className="text-slate-600 dark:text-slate-300 w-5 h-5" />
          </motion.button>
        </div>
      </motion.header>

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        {/* Main content */}
        <div className="lg:col-span-3 flex flex-col space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<Users />}
              title={t.totalUsers}
              value={totalUsers}
              change="+5.2%"
              changeType="increase"
              index={0}
              gradient="from-sky-500 to-blue-600"
              accentColor="#0ea5e9"
            />
            <StatCard
              icon={<MessageSquare />}
              title={t.dashboardTotalChats}
              value={totalChats}
              change="+12%"
              changeType="increase"
              index={1}
              gradient="from-blue-500 to-indigo-600"
              accentColor="#3b82f6"
            />
            <StatCard
              icon={<Activity />}
              title={t.activeUsers}
              value={activeUsers}
              change="+8.1%"
              changeType="increase"
              index={2}
              gradient="from-cyan-500 to-sky-600"
              accentColor="#06b6d4"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard delay={600}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-700 dark:text-white flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-sky-500" />
                    <span>{t.chatsPerDay}</span>
                  </h2>
                  <div className="flex items-center space-x-2">
                    <PulseIndicator color="bg-sky-500" size="w-2 h-2" />
                    <span className="text-sky-500 text-xs font-medium">실시간</span>
                  </div>
                </div>
                <Chart options={apexAreaChartOptions} series={apexAreaChartSeries} type="area" height={250} />
              </div>
            </GlassCard>
            <GlassCard delay={750}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-700 dark:text-white flex items-center space-x-2">
                    <Car className="w-5 h-5 text-sky-500" />
                    <span>{t.usersByCarModel}</span>
                  </h2>
                </div>
                <Chart options={apexBarChartOptions} series={apexBarChartSeries} type="bar" height={250} />
              </div>
            </GlassCard>
          </div>
          
          <GlassCard delay={1000}>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-700 dark:text-white mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-sky-500" />
                <span>{t.recentActivity}</span>
              </h2>
              <ul className="space-y-3">
                {mockChats.slice(0, 4).map((chat, index) => (
                  <motion.li
                    key={chat.id}
                    className="flex items-center space-x-3 p-3 rounded-xl bg-white/30 dark:bg-slate-700/30 border border-white/20 dark:border-slate-600/50 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all duration-300"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <div className="relative">
                      <div className={`p-2 rounded-full ${chat.totalChats > 10 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-sky-400 to-sky-600'}`}>
                        {chat.totalChats > 10 ? <UserPlus size={14} className="text-white" /> : <Users size={14} className="text-white" />}
                      </div>
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1">
                          <PulseIndicator size="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-700 dark:text-white">{chat.userName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{chat.lastMessage.substring(0, 20)}...</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-slate-400 dark:text-slate-500">{chat.timestamp}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          <GlassCard delay={800}>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-700 dark:text-white mb-4 flex items-center space-x-2">
                <Eye className="w-5 h-5 text-sky-500" />
                <span>{t.userInsights}</span>
              </h2>
              <Chart options={apexBarChartOptionsForRegion} series={apexBarChartSeriesForRegion} type="bar" height={200} />
              <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">{t.usersByRegion}</div>
            </div>
          </GlassCard>

          <GlassCard delay={1000}>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-white mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5 text-sky-500" />
                <span>{t.performanceMetrics}</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">{t.responseTime}</span>
                  <span className="text-sky-500 font-bold">1.2s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">{t.satisfaction}</span>
                  <span className="text-blue-500 font-bold">96%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">{t.serviceUptime}</span>
                  <span className="text-cyan-500 font-bold">99.9%</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard delay={1200} className="flex-grow flex flex-col">
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-white mb-4 flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-sky-500" />
                <span>{t.faqTop3}</span>
              </h3>
              <ul className="space-y-3 text-sm flex-grow flex flex-col justify-around">
                <li className="flex justify-between items-center text-slate-500 dark:text-slate-400 hover:text-sky-500 cursor-pointer transition-colors">
                  <span>1. How to reset password?</span>
                  <span className="font-bold text-sky-500">124</span>
                </li>
                <li className="flex justify-between items-center text-slate-500 dark:text-slate-400 hover:text-sky-500 cursor-pointer transition-colors">
                  <span>2. Where to find my policy?</span>
                  <span className="font-bold text-sky-500">98</span>
                </li>
                <li className="flex justify-between items-center text-slate-500 dark:text-slate-400 hover:text-sky-500 cursor-pointer transition-colors">
                  <span>3. How to contact support?</span>
                  <span className="font-bold text-sky-500">72</span>
                </li>
              </ul>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;