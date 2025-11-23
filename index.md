---
layout: default
title: "INTERFACE::V.2.0"
---

{% assign cv = site.data.cv_data %}

<div class="hud-panel">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
        <div>
            <div style="color: var(--neon-pink); font-family: 'JetBrains Mono'; font-size: 0.8rem; margin-bottom: 5px;">
                ID: {{ cv.name.en | upcase | replace: " ", "_" }} // STATUS: ONLINE
            </div>
            <h1>{{ cv.name.en }}</h1>
            <div style="font-size: 1.2rem; color: var(--text-muted); margin-top: 0.5rem;">
                > {{ cv.title.en }} <span class="blink">_</span>
            </div>
        </div>
        
        <div style="text-align: right; font-family: 'JetBrains Mono'; font-size: 0.9rem; margin-top: 1rem;">
            {% if cv.contact.website %}
            <div><a href="{{ cv.contact.website }}">WEB::UPLINK</a></div>
            {% endif %}
            {% if cv.contact.github %}
            <div><a href="{{ cv.contact.github }}">GIT::REPO</a></div>
            {% endif %}
            {% if cv.contact.linkedin %}
            <div><a href="{{ cv.contact.linkedin }}">NET::LINKEDIN</a></div>
            {% endif %}
            <div style="color: var(--neon-cyan); margin-top: 5px;">LOC::{{ cv.contact.location.en | upcase }}</div>
        </div>
    </div>
</div>

<section>
    <h2>SYSTEM_DIAGNOSTIC</h2>
    <p style="font-size: 1.1rem; color: #fff; border-left: 4px solid var(--neon-cyan); padding-left: 1.5rem; margin-left: 0;">
        {{ cv.summary.en }}
    </p>
</section>

<section>
    <h2>ACTIVE_PROTOCOLS</h2>
    
    {% if cv.skills.backend %}
    <div style="margin-bottom: 1.5rem;">
        <div style="font-family: 'Orbitron'; color: var(--text-muted); font-size: 0.8rem; margin-bottom: 0.5rem;">
            [ BACKEND_ARCHITECTURE ]
        </div>
        <div class="skill-grid">
            {% for s in cv.skills.backend %} 
                <div class="skill-chip">{{ s }}</div> 
            {% endfor %}
        </div>
    </div>
    {% endif %}

    {% if cv.skills.frontend %}
    <div style="margin-bottom: 1.5rem;">
        <div style="font-family: 'Orbitron'; color: var(--text-muted); font-size: 0.8rem; margin-bottom: 0.5rem;">
            [ FRONTEND_VISUALS ]
        </div>
        <div class="skill-grid">
            {% for s in cv.skills.frontend %} 
                <div class="skill-chip">{{ s }}</div> 
            {% endfor %}
        </div>
    </div>
    {% endif %}
    
    {% if cv.skills.tools %}
    <div>
        <div style="font-family: 'Orbitron'; color: var(--text-muted); font-size: 0.8rem; margin-bottom: 0.5rem;">
            [ DEPLOYMENT_TOOLS ]
        </div>
        <div class="skill-grid">
            {% for s in cv.skills.tools %} 
                <div class="skill-chip">{{ s }}</div> 
            {% endfor %}
        </div>
    </div>
    {% endif %}
</section>

<section>
    <h2>MISSION_LOGS</h2>
    {% for exp in cv.experience %}
    <div class="job-card">
        <div class="job-title">{{ exp.role.en }}</div>
        <div class="job-meta">
            {{ exp.company }}  //  {{ exp.period }}  //  <span style="color: var(--neon-cyan)">{{ exp.location.en }}</span>
        </div>
        <ul style="list-style: none; padding: 0; margin: 0;">
            {% for item in exp.details.en %}
                <li style="margin-bottom: 0.8rem; padding-left: 1.5rem; position: relative;">
                    <span style="position: absolute; left: 0; color: var(--neon-pink);">>></span>
                    {{ item }}
                </li>
            {% endfor %}
        </ul>
    </div>
    {% endfor %}
</section>

{% if cv.publications %}
<section>
    <h2>DATA_ARCHIVES</h2>
    {% for pub in cv.publications %}
    <div style="border: 1px solid #333; padding: 1rem; margin-bottom: 1rem; background: rgba(0,0,0,0.3);">
        <strong style="color: #fff; font-family: 'Orbitron'">{{ pub.title }}</strong>
        <div style="font-family: 'JetBrains Mono'; font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">
            REL: {{ pub.year }} | CLASS: {{ pub.type }}
        </div>
    </div>
    {% endfor %}
</section>
{% endif %}

<section style="margin-top: 4rem; margin-bottom: 4rem;">
    {% assign latest_cv = site.data.cv_list.cvs | first %}
    
    {% if latest_cv %}
        <a href="{{ latest_cv.url }}" class="mega-btn" target="_blank">
            DOWNLOAD_FULL_INTEL [PDF]
        </a>
        <div style="text-align: center; font-family: 'JetBrains Mono'; color: var(--text-muted); margin-top: 10px; font-size: 0.8rem;">
            LATEST_BUILD: {{ latest_cv.updated }} // VERIFIED
        </div>
    {% else %}
        <a href="mailto:{{ cv.contact.email }}" class="mega-btn">
            REQUEST_SECURE_CHANNEL [EMAIL]
        </a>
        <div style="text-align: center; font-family: 'JetBrains Mono'; color: var(--text-muted); margin-top: 10px; font-size: 0.8rem;">
            PDF_ARCHIVE_OFFLINE // MANUAL_OVERRIDE_REQUIRED
        </div>
    {% endif %}
</section>

<style>
.blink { animation: blink-anim 1s infinite; }
@keyframes blink-anim { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
</style>
