---
layout: default
title: "Profile"
---

{% assign cv = site.data.cv_data %}

<header style="text-align: center; margin-bottom: 4rem;">
    <div class="status-badge">
        <div class="status-dot"></div>
        Available for Remote Work
    </div>
    
    <h1>{{ cv.name.en }}</h1>
    <div style="font-size: 1.25rem; color: #94a3b8; margin-bottom: 1.5rem;">
        {{ cv.title.en }}
    </div>

    <div style="display: flex; justify-content: center; gap: 1.5rem; font-size: 0.95rem;">
        {% if cv.contact.github %}
        <a href="{{ cv.contact.github }}" target="_blank">GitHub</a>
        {% endif %}
        {% if cv.contact.linkedin %}
        <a href="{{ cv.contact.linkedin }}" target="_blank">LinkedIn</a>
        {% endif %}
        {% if cv.contact.website %}
        <a href="{{ cv.contact.website }}" target="_blank">Portfolio</a>
        {% endif %}
    </div>
</header>

<section>
    <h2>About</h2>
    <div class="glass-card">
        <p style="margin: 0; font-size: 1.05rem; color: #e2e8f0;">
            {{ cv.summary.en }}
        </p>
    </div>
</section>

<section>
    <h2>Tech Stack</h2>
    
    <div class="glass-card">
        {% if cv.skills.backend %}
        <div style="margin-bottom: 1.5rem;">
            <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 0.8rem;">Core Backend</div>
            <div class="pill-grid">
                {% for s in cv.skills.backend %} <span class="pill">{{ s }}</span> {% endfor %}
            </div>
        </div>
        {% endif %}

        {% if cv.skills.frontend %}
        <div style="margin-bottom: 1.5rem;">
            <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 0.8rem;">Frontend & UI</div>
            <div class="pill-grid">
                {% for s in cv.skills.frontend %} <span class="pill">{{ s }}</span> {% endfor %}
            </div>
        </div>
        {% endif %}

        {% if cv.skills.tools %}
        <div>
            <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 0.8rem;">Infrastructure & Tools</div>
            <div class="pill-grid">
                {% for s in cv.skills.tools %} <span class="pill">{{ s }}</span> {% endfor %}
            </div>
        </div>
        {% endif %}
    </div>
</section>

<section>
    <h2>Experience</h2>
    
    {% for exp in cv.experience %}
    <div class="timeline-item">
        <div class="timeline-role">{{ exp.role.en }}</div>
        <div class="timeline-meta">
            <span style="color: #fff;">{{ exp.company }}</span> • {{ exp.period }}
        </div>
        <div class="glass-card" style="padding: 1.5rem;">
            <ul style="margin: 0; padding-left: 1.2rem; color: #cbd5e1;">
                {% for item in exp.details.en %}
                    <li style="margin-bottom: 0.5rem;">{{ item }}</li>
                {% endfor %}
            </ul>
        </div>
    </div>
    {% endfor %}
</section>

{% if cv.publications %}
<section>
    <h2>Publications</h2>
    {% for pub in cv.publications %}
    <div class="glass-card" style="padding: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
            <div style="font-weight: 700; color: #fff;">{{ pub.title }}</div>
            <div style="font-size: 0.9rem; color: #94a3b8;">{{ pub.year }} • {{ pub.type }}</div>
        </div>
    </div>
    {% endfor %}
</section>
{% endif %}

<section style="margin-top: 5rem; text-align: center;">
    {% assign latest_cv = site.data.cv_list.cvs | first %}
    
    {% if latest_cv %}
        <a href="{{ latest_cv.url }}" class="cta-button" target="_blank">
            Download Full PDF Resume
        </a>
        <div style="margin-top: 1rem; font-size: 0.85rem; color: #64748b;">
            Last updated: {{ latest_cv.updated }} • Secure Direct Download
        </div>
    {% else %}
        <a href="mailto:{{ cv.contact.email }}" class="cta-button" style="background: linear-gradient(135deg, #334155 0%, #1e293b 100%);">
            Request PDF via Email
        </a>
    {% endif %}
</section>
