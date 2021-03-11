#region

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web.Compilation;

#endregion

namespace HiDoctor
{
    public class PluginAreaBootstrapper
    {
        public static readonly List<Assembly> PluginAssemblies = new List<Assembly>();

        public static List<string> PluginNames()
        {
            return PluginAssemblies.Select(
                pluginAssembly => pluginAssembly.GetName().Name)
                .ToList();
        }

        public static void Init()
        {
            try
            {
                var fullPluginPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Areas");

                foreach (var file in Directory.EnumerateFiles(fullPluginPath, "HiDoctor*.dll", SearchOption.AllDirectories))
                    PluginAssemblies.Add(Assembly.LoadFile(file));
                foreach (var file in Directory.EnumerateFiles(fullPluginPath, "CCM.dll", SearchOption.AllDirectories))
                    PluginAssemblies.Add(Assembly.LoadFile(file));
                foreach (var file in Directory.EnumerateFiles(fullPluginPath, "HDNextGen.dll", SearchOption.AllDirectories))
                    PluginAssemblies.Add(Assembly.LoadFile(file));

                PluginAssemblies.ForEach(BuildManager.AddReferencedAssembly);

                // Add assembly handler for strongly-typed view models
                AppDomain.CurrentDomain.AssemblyResolve += AssemblyResolve;
            }
            catch (Exception)
            {
            }
        }

        private static Assembly AssemblyResolve(object sender, ResolveEventArgs resolveArgs)
        {
            var currentAssemblies = AppDomain.CurrentDomain.GetAssemblies();
            // Check we don't already have the assembly loaded
            foreach (var assembly in currentAssemblies)
            {
                if (assembly.FullName == resolveArgs.Name || assembly.GetName().Name == resolveArgs.Name)
                {
                    return assembly;
                }
            }

            return null;
        }
    }
}