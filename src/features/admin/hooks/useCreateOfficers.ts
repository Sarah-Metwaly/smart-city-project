import { useState } from 'react';
import axios from 'axios';
import { adminService } from '../services/admin.services';

import type { Department } from '../types/admin.types';

export function useCreateOfficer(
  showToast: (msg: string, type: 'success' | 'error') => void,
  onSuccess: () => void,
) {
  const [officerForm, setOfficerForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    department: 'Police' as Department,
  });

  const [officerPhoto, setOfficerPhoto] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerPhoto) return showToast('Please select a photo', 'error');
    setFormLoading(true);
    const fd = new FormData();
    Object.entries(officerForm).forEach(([k, v]) => fd.append(k, String(v)));
    fd.append('officerPhoto', officerPhoto);
    try {
      await adminService.createOfficer(fd);
      showToast('Officer created successfully', 'success');
      setOfficerForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        department: 'Police',
      });
      setOfficerPhoto(null);
      onSuccess();
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to create officer';
      showToast(msg, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  return {
    officerForm,
    setOfficerForm,
    officerPhoto,
    setOfficerPhoto,
    formLoading,
    handleCreateOfficer,
  };
}
