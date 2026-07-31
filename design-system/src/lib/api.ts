const API_BASE = 'http://127.0.0.1:8000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function getDestinations() {
  return request<{ id: string; name: string; region: string; category: string; story: string; history: string; culture: string; bestTime: string; nearbyAttractions: string[]; localFood: string[]; artisans: string[]; travelTips: string[]; responsibleTips: string[]; ecoScore: number; difficulty: string; budget: string; imageKey?: string; heroImageKey?: string }[]>('/destinations')
}

export async function getDashboard() {
  return request<{ stats: Array<{ label: string; value: string }>; snapshot: { title: string; summary: string; highlights: Array<{ label: string; value: string }> } }>('/dashboard')
}

export async function createJourney(payload: unknown) {
  return request<{ title: string; intro: string; days: Array<{ day: string; place: string; focus: string; note: string }> }>('/journey', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}


export async function getReports() {
  return request<Array<{
    id: string;
    category: string;
    severity: string;
    description: string;
    location: string;
    imagePath: string | null;
    status: string;
    createdAt: string;
  }>>('/reports');
}

export async function createReport(payload: FormData) {
  // When using FormData, the browser sets the Content-Type header automatically.
  // We must remove it from our custom headers.
  const response = await fetch(`${API_BASE}/report`, {
    method: 'POST',
    body: payload,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<{ reportId: string; status: string; steps: Array<{ label: string; detail: string }> }>;
}
