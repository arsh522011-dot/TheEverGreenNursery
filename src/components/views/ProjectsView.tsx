import React from 'react';
import { Project } from '../../types';
import { BeforeAfterSlider } from '../common/BeforeAfterSlider';
import { MapPin, CheckCircle2, MessageSquare } from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  onOpenEnquiry: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onOpenEnquiry }) => {
  return (
    <div className="bg-[#faf8f5] text-[#1a2e26] min-h-screen pt-20 sm:pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-700 block">
            LANDSCAPE PORTFOLIO
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#062319] font-light">
            Estate & Commercial Projects
          </h1>
          <p className="text-sm text-emerald-900/70 leading-relaxed">
            Explore our completed landscape architectural projects and turnkey botanical designs.
          </p>
        </div>

        <div className="space-y-20">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-900/10 shadow-xl space-y-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 uppercase tracking-wider mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{proj.location} • {proj.category}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl text-[#062319] font-light">
                  {proj.title}
                </h2>
              </div>

              {/* Before/After Interactive Comparison Slider */}
              <BeforeAfterSlider
                beforeImage={proj.beforeImage}
                afterImage={proj.afterImage}
                beforeLabel="INITIAL SITE CONDITION"
                afterLabel="VERDANT REALM DESIGN"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-emerald-900/10 text-xs">
                <div>
                  <span className="font-mono text-[10px] uppercase text-emerald-800 font-semibold block mb-1">Project Concept</span>
                  <p className="text-emerald-950/80 leading-relaxed">{proj.description}</p>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase text-emerald-800 font-semibold block mb-1">Specimen Trees & Flora Used</span>
                  <ul className="space-y-1 text-emerald-900">
                    {proj.plantsUsed.map((p, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase text-emerald-800 font-semibold block mb-1">Environmental Impact & Results</span>
                  <p className="text-emerald-950/80 leading-relaxed font-serif italic text-sm">{proj.results}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-[#062319] text-white p-8 sm:p-12 rounded-3xl text-center space-y-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-light">Have a Landscape or Estate Project in Mind?</h3>
          <p className="text-xs text-emerald-300/80 max-w-xl mx-auto">
            Our landscape architects offer site surveys, soil analysis, and 3D CAD master plans for luxury residences and commercial venues.
          </p>
          <button
            onClick={onOpenEnquiry}
            className="px-8 py-3.5 rounded-full bg-emerald-500 text-[#062319] font-semibold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors inline-flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Schedule Site Survey</span>
          </button>
        </div>
      </div>
    </div>
  );
};
