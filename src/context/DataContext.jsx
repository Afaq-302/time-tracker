import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id || null;

  const [projects, setProjects] = useState([]);
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const requestJson = useCallback(async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      credentials: 'include',
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'Request failed.');
    }
    return data;
  }, []);

  const normalizeProject = useCallback((project) => {
    if (!project) return project;
    const isActive = project.isActive ?? project.status === 'active';
    return {
      ...project,
      client: project.client ?? project.clientName ?? null,
      status: isActive ? 'active' : 'archived',
      billable: project.billable ?? project.hourlyRate != null,
    };
  }, []);

  const normalizeEntry = useCallback((entry) => {
    if (!entry) return entry;
    return {
      ...entry,
      entryType: entry.entryType ?? 'timer',
      startTime: entry.startTime ?? entry.startAt,
      endTime: entry.endTime ?? entry.endAt,
      duration: entry.duration ?? entry.durationSec,
    };
  }, []);

  const toApiProject = useCallback((project) => {
    return {
      name: project.name,
      clientName: project.client ?? project.clientName ?? null,
      hourlyRate:
        project.billable === false
          ? null
          : project.hourlyRate ?? null,
      color: project.color ?? null,
      isActive: project.status ? project.status === 'active' : project.isActive ?? true,
    };
  }, []);

  const toApiEntry = useCallback((entry) => {
    return {
      projectId: entry.projectId,
      entryType: entry.entryType,
      description: entry.description ?? null,
      startAt: entry.startTime ?? entry.startAt,
      endAt: entry.endTime ?? entry.endAt ?? null,
      durationSec: entry.duration ?? entry.durationSec,
      billable: entry.billable ?? false,
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      if (!userId) {
        if (isActive) {
          setProjects([]);
          setEntries([]);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        const [projectsResponse, entriesResponse] = await Promise.all([
          requestJson('/api/projects'),
          requestJson('/api/time-entries'),
        ]);

        if (isActive) {
          setProjects((projectsResponse.projects || []).map(normalizeProject));
          setEntries((entriesResponse.entries || []).map(normalizeEntry));
        }
      } catch (error) {
        if (isActive) {
          setProjects([]);
          setEntries([]);
          toast({
            title: 'Unable to load data',
            description: error.message || 'Please try again.',
          });
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isActive = false;
    };
  }, [normalizeEntry, normalizeProject, requestJson, userId]);

  const addProject = useCallback((project) => {
    if (!userId) return;
    return requestJson('/api/projects', {
      method: 'POST',
      body: JSON.stringify(toApiProject(project)),
    })
      .then(({ project: created }) => {
        const normalized = normalizeProject(created);
        setProjects(prev => [normalized, ...prev]);
        toast({
          title: 'Project created',
          description: `"${normalized.name}" has been created successfully.`,
        });
        return normalized;
      })
      .catch((error) => {
        toast({
          title: 'Project failed',
          description: error.message || 'Unable to create project.',
        });
        return null;
      });
  }, [normalizeProject, requestJson, toApiProject, userId]);

  const updateProject = useCallback((id, project) => {
    if (!userId) return;
    requestJson(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(toApiProject(project)),
    })
      .then(({ project: updated }) => {
        const normalized = normalizeProject(updated);
        setProjects(prev => prev.map(p => p.id === id ? normalized : p));
        toast({
          title: 'Project updated',
          description: 'Your changes have been saved.',
        });
      })
      .catch((error) => {
        toast({
          title: 'Project update failed',
          description: error.message || 'Unable to update project.',
        });
      });
  }, [normalizeProject, requestJson, toApiProject, userId]);

  const deleteProject = useCallback((id) => {
    if (!userId) return;
    requestJson(`/api/projects/${id}`, { method: 'DELETE' })
      .then(() => {
        setProjects(prev => prev.filter(p => p.id !== id));
        toast({
          title: 'Project deleted',
          description: 'The project has been removed.',
        });
      })
      .catch((error) => {
        toast({
          title: 'Project delete failed',
          description: error.message || 'Unable to delete project.',
        });
      });
  }, [requestJson, userId]);

  const addEntry = useCallback((entry) => {
    if (!userId) return;
    requestJson('/api/time-entries', {
      method: 'POST',
      body: JSON.stringify(toApiEntry(entry)),
    })
      .then(({ entry: created }) => {
        setEntries(prev => [normalizeEntry(created), ...prev]);
        toast({
          title: 'Time entry saved',
          description: 'Your time has been recorded.',
        });
      })
      .catch((error) => {
        toast({
          title: 'Entry failed',
          description: error.message || 'Unable to save entry.',
        });
      });
  }, [normalizeEntry, requestJson, toApiEntry, userId]);

  const updateEntry = useCallback((id, entry) => {
    if (!userId) return;
    requestJson(`/api/time-entries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(toApiEntry(entry)),
    })
      .then(({ entry: updated }) => {
        setEntries(prev => prev.map(e => e.id === id ? normalizeEntry(updated) : e));
        toast({
          title: 'Entry updated',
          description: 'Your changes have been saved.',
        });
      })
      .catch((error) => {
        toast({
          title: 'Entry update failed',
          description: error.message || 'Unable to update entry.',
        });
      });
  }, [normalizeEntry, requestJson, toApiEntry, userId]);

  const deleteEntry = useCallback((id) => {
    if (!userId) return;
    requestJson(`/api/time-entries/${id}`, { method: 'DELETE' })
      .then(() => {
        setEntries(prev => prev.filter(e => e.id !== id));
        toast({
          title: 'Entry deleted',
          description: 'The time entry has been removed.',
        });
      })
      .catch((error) => {
        toast({
          title: 'Entry delete failed',
          description: error.message || 'Unable to delete entry.',
        });
      });
  }, [requestJson, userId]);

  const getProjectById = useCallback((id) => {
    return projects.find(p => p.id === id && (!userId || p.userId === userId));
  }, [projects, userId]);

  const getEntryById = useCallback((id) => {
    return entries.find(e => e.id === id && (!userId || e.userId === userId));
  }, [entries, userId]);

  const getEntriesByProject = useCallback((projectId) => {
    return entries.filter(e => e.projectId === projectId && (!userId || e.userId === userId));
  }, [entries, userId]);

  return (
    <DataContext.Provider
      value={{
        projects,
        entries,
        isLoading,
        addProject,
        updateProject,
        deleteProject,
        addEntry,
        updateEntry,
        deleteEntry,
        getProjectById,
        getEntryById,
        getEntriesByProject,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
