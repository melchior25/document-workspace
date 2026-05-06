const steps = ['Choose template', 'Add source', 'Generate draft']

function WorkspaceIntro() {
  return (
    <section className="rounded-[36px] border border-stone-200/80 bg-white px-6 py-7 shadow-[0_18px_60px_rgba(28,25,23,0.06)] md:px-8 md:py-8">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-stone-500">
            Document workspace
          </p>

          <h2 className="mt-2 max-w-[740px] text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] text-stone-950 md:text-[48px]">
            Create a professional document from a clear guided flow.
          </h2>

          <p className="mt-4 max-w-[680px] text-base leading-7 text-stone-500">
            Start with a template, provide your notes or source files, and open
            the result in an editable AI-assisted document workspace.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 lg:w-[430px]">
          {steps.map((step, index) => (
            <div
              key={step}
              className="rounded-[20px] border border-stone-200 bg-stone-50 px-4 py-3"
            >
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-stone-400">
                Step {index + 1}
              </p>
              <p className="mt-1 text-sm font-semibold text-stone-900">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorkspaceIntro
