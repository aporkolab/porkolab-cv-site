---
layout: default
title: "Portfolio"
---

{% assign cv = site.data.cv_data %}

<section style="min-height: 80vh; display: flex; flex-direction: column; justify-content: center;">
    
    <div class="status-pill">
        <div class="status-dot"></div>
        Open for Senior Roles (Remote)
    </div>

    <h1>
        {{ cv.name.en }}<br>
        <span style="color: #666;">{{ cv.title.en }}</span>
    </h1>

    <p style="max-width: 600px; font-size: 1.2rem; color: #ccc; margin-bottom: 3rem;">
        {{ cv.summary.en }}
    </p>

    <div style="display: flex; gap: 2rem; font-family: 'Space Grotesk'; font-weight: 500;">
        {% if cv.contact.github %}
        <a href="{{ cv.contact.github }}" target="_blank">GitHub ↗</a>
        {% endif %}
        {% if cv.contact.linkedin %}
        <a href="{{ cv.contact.linkedin }}" target="_blank">LinkedIn ↗</a>
        {% endif %}
        {% if cv.contact.website %}
        <a href="{{ cv.contact.website }}" target="_blank">Portfolio ↗</a>
        {% endif %}
    </div>
</section>


<div class="grid-section">
    <div class="sticky-header">
        <h3>01 // Experience</h3>
        <div style="color: #666; font-size: 0.9rem;">Professional Timeline</div>
    </div>
    
    <div>
        {% for exp in cv.experience %}
        <div class="job-item">
            <div class="job-role">{{ exp.role.en }}</div>
            <div class="job-meta">
                <span>{{ exp.company }}</span>
                <span>{{ exp.period }}</span>
                <span style="color: var(--accent)">{{ exp.location.en }}</span>
            </div>
            <ul class="job-details" style="list-style: none; padding: 0;">
                {% for item in exp.details.en %}
                    <li>{{ item }}</li>
                {% endfor %}
            </ul>
        </div>
        {% endfor %}
    </div>
</div>


<div class="grid-section">
    <div class="sticky-header">
        <h3>02 // Expertise</h3>
        <div style="color: #666; font-size: 0.9rem;">Technical Arsenal</div>
    </div>
    
    <div>
        {% if cv.skills.backend %}
        <div style="margin-bottom: 3rem;">
            <div style="color: #888; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem;">Backend Architecture</div>
            <div class="skill-wrapper">
                {% for s in cv.skills.backend %} <div class="skill-tag">{{ s }}</div> {% endfor %}
            </div>
        </div>
        {% endif %}

        {% if cv.skills.frontend %}
        <div style="margin-bottom: 3rem;">
            <div style="color: #888; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem;">Frontend & UX</div>
            <div class="skill-wrapper">
                {% for s in cv.skills.frontend %} <div class="skill-tag">{{ s }}</div> {% endfor %}
            </div>
        </div>
        {% endif %}

        {% if cv.skills.tools %}
        <div>
            <div style="color: #888; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem;">DevOps & Tools</div>
            <div class="skill-wrapper">
                {% for s in cv.skills.tools %} <div class="skill-tag">{{ s }}</div> {% endfor %}
            </div>
        </div>
        {% endif %}
    </div>
</div>


<div class="grid-section" style="border-bottom: none;">
    <div class="sticky-header">
        <h3>03 // Resume</h3>
        <div style="color: #666; font-size: 0.9rem;">PDF Format</div>
    </div>
    
    <div>
        {% assign latest_cv = site.data.cv_list.cvs | first %}
        
        {% if latest_cv %}
            <a href="{{ latest_cv.url }}" class="download-btn" target="_blank">
                Download Resume (PDF)
            </a>
            <p style="text-align: center; margin-top: 1rem; color: #555; font-family: monospace;">
                Version: {{ latest_cv.updated }} • Secure Download
            </p>
        {% else %}
            <button class="download-btn" style="opacity: 0.5; cursor: not-allowed;">
                PDF Generating...
            </button>
            <p style="text-align: center; margin-top: 1rem; color: #555; font-family: monospace;">
                System checks in progress. Please check back in 60s.
            </p>
        {% endif %}
    </div>
</div>

<footer>
    <div>© {{ "now" | date: "%Y" }} {{ cv.name.en }}</div>
    <div>Built with PorkolabPersonaΔ</div>
</footer>
