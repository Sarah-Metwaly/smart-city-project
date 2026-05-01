# smart-city-project
# 🛡️ Aman Smart City - YOLOv8 Detection Model

## 📌 Overview
This repository contains the artificial intelligence component of the **Aman Smart City** project. We utilized **YOLOv8** to build a real-time detection model capable of identifying security threats, emergencies, and anomalies in video feeds. 

The current version of the model has been trained for **150 Epochs**, showing solid progress in understanding complex visual scenarios.

---

## 📊 Model Evaluation & Metrics (150 Epochs)

The model achieved an overall **mAP@0.5 of 67.5%**, demonstrating a strong balance between precision and recall across multiple classes.

### 🏆 Class-Specific Performance (mAP@0.5)
| Class | mAP@0.5 | Status & Insights |
| :--- | :---: | :--- |
| **Theft** | `0.907` | **Excellent:** Highest performing class. Distinct visual features make it easily recognizable despite having fewer instances. |
| **Normal** | `0.733` | **Good:** Reliably distinguishes normal behavior from anomalies. |
| **Weapon** | `0.697` | **Good:** Performs well but occasionally confuses weapons with background objects (39% background confusion). |
| **Fall** | `0.691` | **Good:** Solid detection for medical emergencies/falls. |
| **Fire** | `0.596` | **Moderate:** Correctly identifies fire 65% of the time, but struggles with background confusion (35%), likely mistaking reflections or bright lights for small flames. |
| **Fight** | `0.427` | **Challenging:** Complex temporal actions are difficult for static-frame models. 58% of fights are misclassified as background. |

---

## 📂 Dataset Distribution
The model's behavior is heavily influenced by the dataset's class balance. The current instance distribution is as follows:

*   **Weapon:** 6,382 instances *(Most represented)*
*   **Fire:** 5,517 instances
*   **Fight:** 3,082 instances
*   **Fall:** 1,567 instances
*   **Theft:** 1,060 instances
*   **Normal:** 901 instances

---

## 🧠 Deep Dive: Confusion Matrix Insights
Based on the normalized confusion matrix, we have identified key areas for future optimization:

1.  **Action vs. Object:** The model excels at detecting static objects or distinct poses (like "Theft" at 89% accuracy) but struggles with actions that require temporal context over multiple frames (like "Fight" at 42% accuracy).
2.  **Background Noise:** "Fire" and "Weapon" classes suffer from background confusion. The model occasionally misses these objects, merging them with the background environment. 

---

## 🚀 Future Improvements & Next Steps
To push the performance further, especially for the challenging classes, the following steps are planned:
*   **Data Augmentation:** Introduce more varied backgrounds for the `Fire` and `Weapon` classes to reduce background confusion.
*   **Temporal Context:** Explore tracking algorithms or action-recognition specific techniques to improve `Fight` detection, as it relies heavily on motion context.
*   **Hyperparameter Tuning:** Adjust confidence thresholds for specific classes to reduce false negatives.
