import { ref } from '#imports'
import type { ToastState } from '~/types/admin'

const arabicMessages: Record<string, string> = {
  'Course created successfully': 'تم إنشاء الدورة بنجاح',
  'Part created successfully': 'تم إنشاء الجزء بنجاح',
  'Episode created successfully': 'تم إنشاء الدرس بنجاح',
  'Failed to create course': 'فشل في إنشاء الدورة',
  'Failed to create part': 'فشل في إنشاء الجزء',
  'Failed to create episode': 'فشل في إنشاء الدرس',
  'Failed to fetch courses': 'فشل في جلب الدورات',
  'Invalid password': 'كلمة المرور غير صحيحة',
  'Network error': 'خطأ في الاتصال بالخادم',
  'Part renamed successfully': 'تم تغيير اسم الجزء بنجاح',
  'Failed to rename part': 'فشل في تغيير اسم الجزء',
  'Part deleted successfully': 'تم حذف الجزء بنجاح',
  'Failed to delete part': 'فشل في حذف الجزء',
  'Episode renamed successfully': 'تم تغيير اسم الدرس بنجاح',
  'Failed to rename episode': 'فشل في تغيير اسم الدرس',
  'Episode deleted successfully': 'تم حذف الدرس بنجاح',
  'Failed to delete episode': 'فشل في حذف الدرس',
  'Failed to update episode free status': 'فشل في تحديث حالة الدرس المجاني',
  'Failed to update episode lock status': 'فشل في تحديث حالة قفل الدرس',
  'Video uploaded successfully': 'تم رفع الفيديو بنجاح',
  'Failed to upload video': 'فشل في رفع الفيديو'
}

export function useToast() {
  const toast = ref<ToastState>({ show: false, message: '', type: 'success' })

  const showToast = (message: string, type: ToastState['type'] = 'success') => {
    toast.value = {
      show: true,
      message: arabicMessages[message] || message,
      type
    }
    setTimeout(() => {
      toast.value.show = false
    }, 3000)
  }

  return {
    toast,
    showToast
  }
} 