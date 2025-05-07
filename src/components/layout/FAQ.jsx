import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const faqItems = [
    {
      id: 1,
      question: "Qu'est-ce que BizzWiz ?",
      answer: "BizzWiz, c'est votre partenaire digital. Nous prenons en main tous les aspects de votre projet numérique : gestion, développement, suivi, le tout clair — pour que vous n'ayez qu'une seule chose à faire : valider et avancer."
    },
    {
      id: 2,
      question: "Quels types de projets peut-on réaliser avec BizzWiz ?",
      answer: "BizzWiz peut vous accompagner sur tous types de projets numériques : sites web, applications mobiles, logiciels sur mesure, solutions e-commerce, plateformes SaaS, et plus encore."
    },
    {
      id: 3,
      question: "Est-ce que BizzWiz m'aide à créer mon entreprise ?",
      answer: "Absolument! BizzWiz vous accompagne dans la digitalisation de votre entreprise, de la conception initiale jusqu'à la mise en production de vos solutions numériques."
    },
    {
      id: 4,
      question: "Comment fonctionne l'accompagnement par IA ?",
      answer: "Notre IA analyse vos besoins pour optimiser votre projet. Elle identifie les tendances du marché et propose des solutions adaptées à votre secteur d'activité."
    },
    {
      id: 5,
      question: "Qui compose l'équipe BizzWiz ?",
      answer: "L'équipe BizzWiz est composée d'experts en développement, design, marketing digital, et gestion de projet, tous passionnés par l'innovation et l'excellence."
    },
    {
      id: 6,
      question: "Qu'est-ce que BizzWeb Pro ?",
      answer: "BizzWeb Pro est notre solution haut de gamme pour les sites web professionnels, incluant hébergement sécurisé, SEO avancé, et support prioritaire."
    },
    {
      id: 7,
      question: "Combien coûte un projet avec BizzWiz ?",
      answer: "Le coût varie selon la complexité et l'ampleur de votre projet. Nous proposons des forfaits adaptés à chaque besoin et budget, avec une transparence totale sur les tarifs."
    },
    {
      id: 8,
      question: "Comment prendre rendez-vous avec un expert ?",
      answer: "Vous pouvez prendre rendez-vous via notre site web, par téléphone, ou en nous envoyant un email. Un expert vous contactera dans les 24 heures."
    },
    {
      id: 9,
      question: "Puis-je faire appel à BizzWiz sur le long terme ?",
      answer: "Bien sûr! Nous proposons des contrats de maintenance et d'évolution qui vous permettent de bénéficier de notre accompagnement sur le long terme."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    hover: { 
      scale: 1.02,
      backgroundColor: "rgba(139, 92, 246, 0.08)", 
      transition: { duration: 0.2 }
    }
  };
  
  const iconVariants = {
    open: { rotate: 90, scale: 1.1 },
    closed: { rotate: 0, scale: 1 }
  };
  
  const contentVariants = {
    collapsed: { 
      opacity: 0,
      height: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    expanded: { 
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black p-4 sm:p-6 md:p-8 py-16 sm:py-20 md:py-24">
      {mounted && (
        <motion.div 
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-black text-purple-300 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center text-purple-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            FAQ
          </motion.h1>
          
          <motion.div 
            className="space-y-2 sm:space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {faqItems.map((item, index) => (
              <motion.div 
                key={item.id} 
                className="border-b border-purple-800 overflow-hidden rounded"
                variants={itemVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="flex justify-between items-center p-3 sm:p-4 cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center">
                    <motion.span 
                      className="text-sm sm:text-base mr-2 opacity-70"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    >
                      {String(item.id).padStart(2, '0')}
                    </motion.span>
                    <h3 className="text-sm sm:text-base font-medium">
                      {item.question}
                    </h3>
                  </div>
                  <motion.div 
                    variants={iconVariants}
                    animate={openIndex === index ? "open" : "closed"}
                    transition={{ duration: 0.3, type: "spring", stiffness: 500 }}
                  >
                    {openIndex === index ? (
                      <X size={16} className="text-purple-300" />
                    ) : (
                      <Plus size={16} className="text-purple-300" />
                    )}
                  </motion.div>
                </motion.div>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      key={`content-${item.id}`}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      variants={contentVariants}
                    >
                      <motion.div 
                        className="p-3 sm:p-4 pt-0 text-sm sm:text-base text-gray-300"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.answer}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FAQ;