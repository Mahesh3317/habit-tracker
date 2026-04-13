import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabit } from '../context/HabitContext';
import { createCustomTask, validateCustomTask, shouldTaskAppearToday } from '../utils/taskHelpers';

const COLORS = {
  primary: '#667EEA',
  dark: '#1A202C',
  light: '#F7FAFC',
  success: '#48BB78',
  danger: '#F56565',
  warning: '#ED8936',
};

export default function TaskManagementScreen() {
  const { state, addCustomTask, updateCustomTask, deleteCustomTask, toggleCustomTaskActive } = useHabit();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    repeatType: 'daily',
    reminderEnabled: false,
    reminderTime: '09:00',
    pointsReward: 10,
  });

  // Validation errors
  const [errors, setErrors] = useState([]);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      repeatType: 'daily',
      reminderEnabled: false,
      reminderTime: '09:00',
      pointsReward: 10,
    });
    setErrors([]);
  };

  // Handle create task
  const handleCreateTask = () => {
    const validationErrors = validateCustomTask(formData.name, formData.repeatType);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newTask = createCustomTask(
      formData.name,
      formData.repeatType,
      formData.reminderEnabled,
      formData.reminderTime,
      formData.pointsReward,
      formData.description
    );

    addCustomTask(newTask);
    resetForm();
    setShowCreateModal(false);
    Alert.alert('Success', 'Task created successfully!');
  };

  // Handle update task
  const handleUpdateTask = () => {
    if (selectedTask) {
      const validationErrors = validateCustomTask(formData.name, formData.repeatType);
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      updateCustomTask(selectedTask.id, {
        name: formData.name,
        description: formData.description,
        repeatType: formData.repeatType,
        reminderEnabled: formData.reminderEnabled,
        reminderTime: formData.reminderTime,
        pointsReward: formData.pointsReward,
      });

      resetForm();
      setShowEditModal(false);
      setSelectedTask(null);
      Alert.alert('Success', 'Task updated successfully!');
    }
  };

  // Handle delete task
  const handleDeleteTask = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: () => {
            deleteCustomTask(taskId);
            Alert.alert('Success', 'Task deleted successfully!');
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Open edit modal
  const openEditModal = (task) => {
    setSelectedTask(task);
    setFormData({
      name: task.name,
      description: task.description,
      repeatType: task.repeatType,
      reminderEnabled: task.reminderEnabled,
      reminderTime: task.reminderTime,
      pointsReward: task.pointsReward,
    });
    setShowEditModal(true);
  };

  // Task card component
  const TaskCard = ({ task }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={styles.taskInfo}>
          <Text style={styles.taskName}>{task.name}</Text>
          <Text style={styles.taskMeta}>
            {task.repeatType === 'daily' ? '🔄 Daily' : '📅 Weekly'} • {task.pointsReward} pts
          </Text>
          {task.description && <Text style={styles.taskDescription}>{task.description}</Text>}
        </View>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => toggleCustomTaskActive(task.id)}
        >
          <Ionicons
            name={task.isActive ? 'checkmark-circle' : 'ellipse-outline'}
            size={28}
            color={task.isActive ? COLORS.success : '#95A3AD'}
          />
        </TouchableOpacity>
      </View>

      {task.reminderEnabled && (
        <View style={styles.reminderBadge}>
          <Ionicons name="notifications" size={14} color={COLORS.primary} />
          <Text style={styles.reminderText}>Reminder at {task.reminderTime}</Text>
        </View>
      )}

      <View style={styles.taskActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openEditModal(task)}
        >
          <Ionicons name="pencil" size={18} color={COLORS.primary} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteTask(task.id)}
        >
          <Ionicons name="trash" size={18} color={COLORS.danger} />
          <Text style={[styles.actionText, { color: COLORS.danger }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Modal form component
  const TaskForm = ({ isEdit = false }) => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>{isEdit ? 'Edit Task' : 'Create New Task'}</Text>

      {/* Name Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Task Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Read for 30 minutes"
          placeholderTextColor="#95A3AD"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          maxLength={50}
        />
        <Text style={styles.charCount}>{formData.name.length}/50</Text>
      </View>

      {/* Description Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Add details about this task..."
          placeholderTextColor="#95A3AD"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          maxLength={200}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Repeat Type */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Repeat Type *</Text>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[
              styles.toggleOption,
              formData.repeatType === 'daily' && styles.toggleOptionActive,
            ]}
            onPress={() => setFormData({ ...formData, repeatType: 'daily' })}
          >
            <Text
              style={[
                styles.toggleText,
                formData.repeatType === 'daily' && styles.toggleTextActive,
              ]}
            >
              🔄 Daily
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleOption,
              formData.repeatType === 'weekly' && styles.toggleOptionActive,
            ]}
            onPress={() => setFormData({ ...formData, repeatType: 'weekly' })}
          >
            <Text
              style={[
                styles.toggleText,
                formData.repeatType === 'weekly' && styles.toggleTextActive,
              ]}
            >
              📅 Weekly
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reminder */}
      <View style={styles.formGroup}>
        <View style={styles.reminderHeader}>
          <Text style={styles.label}>Reminder</Text>
          <Switch
            value={formData.reminderEnabled}
            onValueChange={(value) =>
              setFormData({ ...formData, reminderEnabled: value })
            }
            trackColor={{ false: '#3E4C59', true: COLORS.primary }}
            thumbColor={formData.reminderEnabled ? '#fff' : '#95A3AD'}
          />
        </View>

        {formData.reminderEnabled && (
          <View style={styles.timeInputContainer}>
            <Text style={styles.timeLabel}>Time:</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="HH:MM"
              placeholderTextColor="#95A3AD"
              value={formData.reminderTime}
              onChangeText={(text) => setFormData({ ...formData, reminderTime: text })}
              maxLength={5}
            />
          </View>
        )}
      </View>

      {/* Points Reward */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Points Reward: {formData.pointsReward}</Text>
        <View style={styles.sliderContainer}>
          <TouchableOpacity
            onPress={() =>
              setFormData({
                ...formData,
                pointsReward: Math.max(5, formData.pointsReward - 5),
              })
            }
          >
            <Text style={styles.sliderButton}>−</Text>
          </TouchableOpacity>

          <View style={styles.sliderDisplay}>
            <View
              style={[
                styles.sliderFill,
                { width: `${((formData.pointsReward - 5) / 95) * 100}%` },
              ]}
            />
          </View>

          <TouchableOpacity
            onPress={() =>
              setFormData({
                ...formData,
                pointsReward: Math.min(100, formData.pointsReward + 5),
              })
            }
          >
            <Text style={styles.sliderButton}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Errors */}
      {errors.length > 0 && (
        <View style={styles.errorContainer}>
          {errors.map((error, index) => (
            <Text key={index} style={styles.errorText}>
              • {error}
            </Text>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.formActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            resetForm();
            setSelectedTask(null);
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={isEdit ? handleUpdateTask : handleCreateTask}
        >
          <Text style={styles.submitButtonText}>
            {isEdit ? 'Update Task' : 'Create Task'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Custom Tasks</Text>
        <Text style={styles.subtitle}>Create and manage your personal tasks</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{state.customTasks.length}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {state.customTasks.filter((t) => t.isActive).length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {state.customTasks.filter((t) => shouldTaskAppearToday(t)).length}
          </Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
      </View>

      {/* Task List */}
      {state.customTasks.length > 0 ? (
        <View style={styles.taskListContainer}>
          <Text style={styles.sectionTitle}>Active Tasks</Text>
          {state.customTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="list-outline" size={48} color="#95A3AD" />
          <Text style={styles.emptyText}>No custom tasks yet</Text>
          <Text style={styles.emptySubtext}>Create one to get started!</Text>
        </View>
      )}

      {/* Create Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => {
          resetForm();
          setShowCreateModal(true);
        }}
      >
        <Ionicons name="add" size={28} color="#fff" />
        <Text style={styles.createButtonText}>New Task</Text>
      </TouchableOpacity>

      {/* Create Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modal}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
              >
                <Ionicons name="close" size={28} color={COLORS.primary} />
              </TouchableOpacity>

              <TaskForm isEdit={false} />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modal}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowEditModal(false);
                  resetForm();
                  setSelectedTask(null);
                }}
              >
                <Ionicons name="close" size={28} color={COLORS.primary} />
              </TouchableOpacity>

              <TaskForm isEdit={true} />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#95A3AD',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#95A3AD',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  taskListContainer: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  taskCard: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  taskMeta: {
    fontSize: 12,
    color: '#95A3AD',
    marginBottom: 6,
  },
  taskDescription: {
    fontSize: 12,
    color: '#B0BAC9',
    fontStyle: 'italic',
  },
  toggleButton: {
    padding: 8,
  },
  reminderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  reminderText: {
    fontSize: 11,
    color: COLORS.primary,
    marginLeft: 6,
    fontWeight: '500',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3E4C59',
    padding: 10,
    borderRadius: 8,
    gap: 6,
  },
  deleteButton: {
    backgroundColor: 'rgba(245, 101, 101, 0.1)',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#95A3AD',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#5A6C7D',
    marginTop: 4,
  },
  createButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  createButtonText: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    width: 60,
    height: 60,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.dark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalContent: {
    padding: 20,
    minHeight: '80%',
    paddingBottom: 40,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  formContainer: {},
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#3E4C59',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
  },
  textarea: {
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: '#95A3AD',
    marginTop: 4,
    textAlign: 'right',
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleOption: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#3E4C59',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  toggleOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#95A3AD',
  },
  toggleTextActive: {
    color: COLORS.primary,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInputContainer: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#3E4C59',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeLabel: {
    color: '#95A3AD',
    fontSize: 12,
    fontWeight: '600',
  },
  timeInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    width: 32,
    textAlign: 'center',
  },
  sliderDisplay: {
    flex: 1,
    height: 6,
    backgroundColor: '#3E4C59',
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  errorContainer: {
    backgroundColor: 'rgba(245, 101, 101, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    marginBottom: 4,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3E4C59',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#95A3AD',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
