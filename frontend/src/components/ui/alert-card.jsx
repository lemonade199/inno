import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "./button";

const AlertCard = React.forwardRef(
  ({
    className,
    icon,
    title,
    description,
    buttonText,
    onButtonClick,
    isVisible,
    onDismiss,
    variant = "destructive", // "destructive" | "success" | "info" | "warning"
    ...props
  }, ref) => {
    
    // Animation variants for the card container
    const cardVariants = {
      hidden: { opacity: 0, y: 50, scale: 0.95 },
      visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25,
          staggerChildren: 0.1,
        }
      },
      exit: { 
        opacity: 0, 
        y: 20, 
        scale: 0.98,
        transition: { duration: 0.2 }
      }
    };

    // Animation variants for child elements for a staggered effect
    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    };

    const getVariantStyles = () => {
      switch (variant) {
        case "success":
          return "bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-emerald-900/20";
        case "info":
          return "bg-gradient-to-br from-sky-600 to-blue-900 text-white shadow-blue-900/20";
        case "warning":
          return "bg-gradient-to-br from-amber-500 to-orange-700 text-white shadow-orange-900/20";
        default: // destructive / alert
          return "bg-gradient-to-br from-rose-600 to-red-900 text-white shadow-red-900/20";
      }
    };

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={ref}
            className={cn(
              "relative w-full max-w-sm overflow-hidden rounded-2xl p-6 shadow-2xl backdrop-blur-md",
              getVariantStyles(),
              className
            )}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
            aria-live="assertive"
            {...props}
          >
            {/* Optional dismiss button */}
            {onDismiss && (
              <motion.div variants={itemVariants} className="absolute top-3 right-3 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
                  onClick={onDismiss}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Dismiss</span>
                </Button>
              </motion.div>
            )}

            {/* Icon with a subtle pulse animation */}
            {icon && (
               <motion.div
                variants={itemVariants}
                className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10"
              >
                 <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    {icon}
                </motion.div>
              </motion.div>
            )}

            {/* Title */}
            <motion.h3 variants={itemVariants} className="text-xl font-bold tracking-tight text-white pr-12">
              {title}
            </motion.h3>

            {/* Description */}
            <motion.p variants={itemVariants} className="mt-2 text-sm text-white/90 max-w-[85%] leading-relaxed">
              {description}
            </motion.p>
            
            {/* Action Button */}
            {buttonText && onButtonClick && (
              <motion.div variants={itemVariants} className="mt-6">
                <Button
                  className="w-full rounded-full bg-white py-5 text-sm font-bold text-slate-900 shadow-lg transition-all duration-200 hover:bg-slate-100 active:scale-95 border-none"
                  onClick={onButtonClick}
                >
                  {buttonText}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
AlertCard.displayName = "AlertCard";

export { AlertCard };
